import { Recipe } from "@/domain/Recipe/Recipe";

export const createUserRecipe = async ({
  name,
  ingredientIds,
}: {
  name: string;
  ingredientIds: string[];
}): Promise<{
  createdRecipe: Recipe;
}> => {
  const response = await fetch("/api/recipes?action=create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, ingredientIds }),
  });

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }
  throw new Error(responseBody.errorMessage);
};
