import { Recipe, RecipeWithIngredients } from "@/domain/Recipe/Recipe";

export interface RecipeRepositoryInterface {
  findRecipesWithIngredients(): Promise<(Recipe & RecipeWithIngredients)[]>;
  findRecipeByName(name: string): Promise<Recipe | null>;
  findRecipeByIngredientIds(ingredientIds: string[]): Promise<Recipe | null>;
  setRecipeToDiscovered(id: string): Promise<Recipe>;
  createRecipe(args: {
    name: string;
    isDiscovered: boolean;
    isInitial?: boolean;
    ingredientIds: string[];
  }): Promise<Recipe>;
  updateIngredientsForRecipe(
    recipeId: string,
    ingredientIds: string[]
  ): Promise<Recipe>;
}
