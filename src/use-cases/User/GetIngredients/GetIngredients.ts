import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class GetIngredients {
  constructor(private ingredientRepository: IngredientRepositoryInterface) {}

  run(): Promise<Ingredient[]> {
    return this.ingredientRepository.findIngredients();
  }
}
