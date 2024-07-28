"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/actions/SubmitButton";
import { Recipe } from "@/domain/Recipe/Recipe";

export type SelectIngredientsResponse = {
  discoveredRecipe?: Recipe;
  errorMessage?: string;
};

export function SelectIngredients({
  ingredients,
  onSubmit,
}: {
  ingredients: Ingredient[];
  onSubmit: (ingredientIds: string[]) => Promise<any>;
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

  const getSelectedIngredients = () => {
    return Object.entries(selection)
      .filter(([_id, isSelected]) => isSelected)
      .map(([id]) => id);
  };

  const [formState, submit] = useFormState<SelectIngredientsResponse | null>(
    onSubmit.bind(null, getSelectedIngredients()),
    null
  );

  const [newlyDiscoveredRecipe, setNewlyDiscoveredRecipe] =
    useState<Recipe | null>(null);

  useEffect(() => {
    if (formState && formState.discoveredRecipe) {
      setNewlyDiscoveredRecipe(formState.discoveredRecipe);
    }
  }, [formState]);

  return (
    <main className="m-auto max-w-6xl p-8 flex flex-col justify-center gap-4">
      Composez une potion connue ou inédite en sélectionnant trois ingrédients :
      <form action={submit}>
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
        <SubmitButton className="fixed right-6 bottom-16 p-8 text-lg">
          Valider
        </SubmitButton>
      </form>
    </main>
  );
}
