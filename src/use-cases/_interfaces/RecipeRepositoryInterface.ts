import { Recipe } from "@/domain/Recipe/Recipe";

export interface RecipeRepositoryInterface {
  findRecipeByName(name: string): Promise<Recipe | null>;
  findRecipeByIngredientIds(ingredientIds: string[]): Promise<Recipe | null>;
  setRecipeToDiscovered(id: string): Promise<Recipe>;
  createRecipe(
    name: string,
    isDiscovered: boolean,
    ingredientIds: string[]
  ): Promise<Recipe>;
  updateIngredientsForRecipe(
    recipeId: string,
    ingredientIds: string[]
  ): Promise<Recipe>;
}
