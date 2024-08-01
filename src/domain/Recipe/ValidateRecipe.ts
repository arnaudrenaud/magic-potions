import { NUMBER_OF_INGREDIENTS_IN_RECIPE } from "@/domain/Recipe/Recipe";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";

export class ValidateRecipe {
  run(name: string, ingredientCount: number) {
    if (!name) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_A_NAME);
    }
    if (ingredientCount !== NUMBER_OF_INGREDIENTS_IN_RECIPE) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS);
    }
  }
}
