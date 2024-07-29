import { Recipe } from "@/domain/Recipe/Recipe";

export const discoverRecipe = async (
  ingredientIds: string[]
): Promise<{
  discoveredRecipe: Recipe;
}> => {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredientIds }),
  });

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }
  throw new Error(responseBody.errorMessage);
};
