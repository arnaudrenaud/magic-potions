import { Ingredient } from "@/domain/Ingredient/Ingredient";

export type Recipe = {
  id: string;
  name: string;
  isDiscovered: boolean;
};

export type RecipeWithIngredients = Recipe & {
  ingredients: Ingredient[];
};
