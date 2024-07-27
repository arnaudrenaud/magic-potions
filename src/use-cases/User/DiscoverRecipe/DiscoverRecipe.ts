import { Recipe } from "@/domain/Recipe/Recipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";

export default class DiscoverRecipe {
  constructor(
    public recipeRepository: RecipeRepositoryInterface,
    private ingredientRepository: IngredientRepositoryInterface
  ) {}

  async run(ingredientIds: string[]): Promise<Recipe> {
    const existingRecipe =
      await this.recipeRepository.findRecipeByIngredientIds(ingredientIds);

    if (!existingRecipe) {
      throw new Error(
        RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED.message
      );
    }
    if (existingRecipe.isDiscovered) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED.message);
    }

    for (const ingredientId of ingredientIds) {
      await this.ingredientRepository.decrementIngredientQuantity(ingredientId);
    }
    return this.recipeRepository.setRecipeToDiscovered(existingRecipe.id);
  }
}
