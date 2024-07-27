import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";

export class ValidateRecipe {
  run(name: string, ingredientCount: number) {
    if (!name) {
      throw new Error(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_A_NAME.message);
    }
    if (ingredientCount !== 3) {
      throw new Error(
        RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS.message
      );
    }
  }
}
