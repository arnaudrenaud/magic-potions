import { InitialRecipe } from "@/domain/Recipe/initial-recipes";
import { Recipe } from "@/domain/Recipe/Recipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { ValidateRecipe } from "@/domain/Recipe/ValidateRecipe";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";

export default class CreateOrUpdateInitialRecipe {
  constructor(
    private recipeRepository: RecipeRepositoryInterface,
    private ingredientRepository: IngredientRepositoryInterface
  ) {}

  async run(recipe: InitialRecipe): Promise<Recipe> {
    new ValidateRecipe().run(recipe.name, recipe.ingredientNames.length);

    const ingredientIds = (
      await Promise.all(
        recipe.ingredientNames.map((name) =>
          this.ingredientRepository.findIngredientByNameOrThrow(name)
        )
      )
    ).map(({ id }) => id);

    const existingRecipeWithSameName =
      await this.recipeRepository.findRecipeByName(recipe.name);
    if (existingRecipeWithSameName) {
      return this.recipeRepository.updateIngredientsForRecipe(
        existingRecipeWithSameName.id,
        ingredientIds
      );
    }

    const existingRecipeWithSameIngredients =
      await this.recipeRepository.findRecipeByIngredientIds(ingredientIds);
    if (existingRecipeWithSameIngredients) {
      throw new Error(
        RECIPE_EXCEPTIONS.RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS.message
      );
    }

    return this.recipeRepository.createRecipe(
      recipe.name,
      false,
      ingredientIds
    );
  }
}
