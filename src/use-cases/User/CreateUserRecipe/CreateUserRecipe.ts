import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { Recipe } from "@/domain/Recipe/Recipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { ValidateRecipe } from "@/domain/Recipe/ValidateRecipe";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";
import AreIngredientQuantitiesSufficient from "@/use-cases/_utils/AreIngredientQuantitiesSufficient";

export const EXCEPTION_RECIPE_MUST_HAVE_A_NAME =
  "EXCEPTION_RECIPE_MUST_HAVE_A_NAME";
export const EXCEPTION_RECIPE_MUST_HAVE_THREE_INGREDIENTS =
  "EXCEPTION_RECIPE_MUST_HAVE_THREE_INGREDIENTS";

export default class CreateUserRecipe {
  constructor(
    private recipeRepository: RecipeRepositoryInterface,
    private ingredientRepository: IngredientRepositoryInterface
  ) {}

  async run(name: string, ingredientIds: string[]): Promise<Recipe> {
    new ValidateRecipe().run(name, ingredientIds.length);
    const areIngredientQuantitiesSufficient =
      await new AreIngredientQuantitiesSufficient(
        this.ingredientRepository
      ).run(ingredientIds, 1);
    if (!areIngredientQuantitiesSufficient) {
      throw new Error(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_INSUFFICIENT_FOR_RECIPE
      );
    }

    if (await this.recipeRepository.findRecipeByName(name)) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_WITH_NAME_ALREADY_EXISTS);
    }
    if (await this.recipeRepository.findRecipeByIngredientIds(ingredientIds)) {
      throw new Error(
        RECIPE_EXCEPTIONS.RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS
      );
    }

    // TODO: wrap recipe creation and ingredient decrementation inside a transaction
    const newRecipe = await this.recipeRepository.createRecipe({
      name,
      isDiscovered: true,
      ingredientIds,
    });
    for (const ingredientId of ingredientIds) {
      await this.ingredientRepository.decrementIngredientQuantity(ingredientId);
    }

    return newRecipe;
  }
}
