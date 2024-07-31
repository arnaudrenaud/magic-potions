import { Ingredient } from "@/domain/Ingredient/Ingredient";

export const incrementIngredientQuantity = async (
  ingredientId: string
): Promise<{
  updatedIngredient: Ingredient;
}> => {
  const response = await fetch(
    `/api/ingredients/${ingredientId}?action=increment`,
    {
      method: "PATCH",
    }
  );

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }
  throw new Error(responseBody.errorMessage);
};
