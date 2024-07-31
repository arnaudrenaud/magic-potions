import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class IncrementIngredientQuantity {
  constructor(private ingredientRepository: IngredientRepositoryInterface) {}

  async run(ingredientId: string): Promise<Ingredient> {
    return this.ingredientRepository.incrementIngredientQuantity(ingredientId);
  }
}
