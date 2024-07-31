import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class AreIngredientQuantitiesSufficient {
  constructor(private ingredientRepository: IngredientRepositoryInterface) {}

  async run(ingredientIds: string[], minimumQuantity: 1): Promise<boolean> {
    for (const ingredientId of ingredientIds) {
      if (
        (await this.ingredientRepository.findIngredientById(ingredientId))
          .quantity < minimumQuantity
      ) {
        return false;
      }
    }
    return true;
  }
}
