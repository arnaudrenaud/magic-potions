"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { discoverRecipe } from "@/app/api-queries/discoverRecipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { CreateRecipe } from "@/components/use-cases/CreateRecipe/CreateRecipe";

export function SelectIngredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const [selection, setSelection] = useState<{
    [ingredientId: string]: boolean;
  }>({});
  const toggleIngredientSelected = (ingredientId: string) => {
    setSelection({
      ...selection,
      [ingredientId]: !Boolean(selection[ingredientId]),
    });
  };

  const getSelectedIngredientIds = () => {
    return Object.entries(selection)
      .filter(([_id, isSelected]) => isSelected)
      .map(([id]) => id);
  };

  const router = useRouter();
  const { toast } = useToast();

  const [shouldShowCreateRecipeDialog, setShouldShowCreateRecipeDialog] =
    useState(false);

  const mutationSubmission = useMutation({
    mutationFn: discoverRecipe,
    onSuccess: ({ discoveredRecipe }) => {
      router.refresh();
      toast({
        title: "Bravo !",
        description: `Vous avez découvert la ${discoveredRecipe.name}.`,
      });
    },
    onError: ({ message }) => {
      if (
        message ===
        RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED.message
      ) {
        setShouldShowCreateRecipeDialog(true);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: message,
        });
      }
    },
  });

  return (
    <main className="flex flex-col justify-center gap-4">
      Découvrez une potion classique ou créez la vôtre en sélectionnant trois
      ingrédients :
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutationSubmission.mutate(getSelectedIngredientIds());
        }}
      >
        <ul className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ingredients.map(({ id, name, quantity }) => (
            <li
              key={id}
              className="w-full h-32 p-3 rounded bg-secondary grid grid-rows-3 items-center text-center"
            >
              <Checkbox
                id={id}
                checked={selection[id]}
                onClick={() => {
                  toggleIngredientSelected(id);
                }}
                className="self-start"
              />
              <label htmlFor={id} className="text-lg">
                {name}
              </label>
              <div className="text-xs text-muted-foreground self-end">{`Qté rest.: ${quantity}`}</div>
            </li>
          ))}
        </ul>
        <Button
          className="fixed right-4 lg:right-10 bottom-20 lg:bottom-24 p-8 text-lg"
          disabled={mutationSubmission.isPending}
        >
          Valider
        </Button>
      </form>
      {shouldShowCreateRecipeDialog ? (
        <CreateRecipe
          onClose={() => {
            setShouldShowCreateRecipeDialog(false);
          }}
          ingredients={ingredients.filter(({ id }) =>
            getSelectedIngredientIds().includes(id)
          )}
        />
      ) : null}
    </main>
  );
}
