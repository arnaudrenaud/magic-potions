"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { discoverRecipe } from "@/app/api-queries/discoverRecipe";

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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    },
  });

  return (
    <main className="m-auto max-w-6xl p-8 flex flex-col justify-center gap-4">
      Composez une potion connue ou inédite en sélectionnant trois ingrédients :
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
          className="fixed right-6 bottom-16 p-8 text-lg"
          disabled={mutationSubmission.isPending}
        >
          Valider
        </Button>
      </form>
    </main>
  );
}
