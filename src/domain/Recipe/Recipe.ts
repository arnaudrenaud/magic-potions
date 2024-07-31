import { Ingredient } from "@/domain/Ingredient/Ingredient";

export type Recipe = {
  id: string;
  name: string;
  isDiscovered: boolean;
  isInitial: boolean;
};

export type RecipeWithIngredients = Recipe & {
  ingredients: Ingredient[];
};

export const NUMBER_OF_INGREDIENTS_IN_RECIPE = 3;
