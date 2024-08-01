import { INGREDIENT_EXCEPTIONS_USER_FACING } from "@/domain/Ingredient/ingredient-exceptions";
import { RECIPE_EXCEPTIONS_USER_FACING } from "@/domain/Recipe/recipe-exceptions";

export const USER_FACING_EXCEPTION_MESSAGES = {
  ...RECIPE_EXCEPTIONS_USER_FACING,
  ...INGREDIENT_EXCEPTIONS_USER_FACING,
};
