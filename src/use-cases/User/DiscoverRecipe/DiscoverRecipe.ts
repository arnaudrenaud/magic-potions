import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import {
  NUMBER_OF_INGREDIENTS_IN_RECIPE,
  Recipe,
} from "@/domain/Recipe/Recipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";
import AreIngredientQuantitiesSufficient from "@/use-cases/_utils/AreIngredientQuantitiesSufficient";

export default class DiscoverRecipe {
  constructor(
    public recipeRepository: RecipeRepositoryInterface,
    private ingredientRepository: IngredientRepositoryInterface
  ) {}

  async run(ingredientIds: string[]): Promise<Recipe> {
    if (ingredientIds.length !== NUMBER_OF_INGREDIENTS_IN_RECIPE) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS);
    }
    const areIngredientQuantitiesSufficient =
      await new AreIngredientQuantitiesSufficient(
        this.ingredientRepository
      ).run(ingredientIds, 1);
    if (!areIngredientQuantitiesSufficient) {
      throw new Error(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_INSUFFICIENT_FOR_RECIPE
      );
    }

    const existingRecipe =
      await this.recipeRepository.findRecipeByIngredientIds(ingredientIds);

    if (!existingRecipe) {
      throw new Error(
        RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED
      );
    }
    if (existingRecipe.isDiscovered) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED);
    }

    for (const ingredientId of ingredientIds) {
      await this.ingredientRepository.decrementIngredientQuantity(ingredientId);
    }
    return this.recipeRepository.setRecipeToDiscovered(existingRecipe.id);
  }
}
