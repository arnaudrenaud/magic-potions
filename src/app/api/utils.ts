import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { getErrorMessage } from "@/lib/utils";

export const DEFAULT_SERVER_ERROR_MESSAGE = "Le serveur a rencontré une erreur";

const EXCEPTIONS: Record<string, string> = {
  ...RECIPE_EXCEPTIONS,
  ...INGREDIENT_EXCEPTIONS,
};

export function handleError(fn: Function) {
  return async function (req: Request, ...rest: any[]) {
    try {
      return await fn(req, ...rest);
    } catch (error) {
      const exception = EXCEPTIONS[getErrorMessage(error)];

      if (!exception) {
        console.error({
          error,
        });
      }

      return Response.json(
        { errorMessage: exception || DEFAULT_SERVER_ERROR_MESSAGE },
        { status: exception ? 400 : 500 }
      );
    }
  };
}
