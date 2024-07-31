import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class DecrementIngredientQuantity {
  constructor(private ingredientRepository: IngredientRepositoryInterface) {}

  async run(ingredientId: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findIngredientById(
      ingredientId
    );

    if (ingredient.quantity === 0) {
      throw new Error(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_MUST_BE_AT_LEAST_ZERO
      );
    }
    return this.ingredientRepository.decrementIngredientQuantity(ingredientId);
  }
}
