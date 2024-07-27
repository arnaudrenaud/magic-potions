import { InitialIngredient } from "@/domain/constants/initial-ingredients";
import { INGREDIENT_INITIAL_QUANTITY } from "@/domain/Ingredient/Ingredient";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class CreateInitialIngredient {
  constructor(
    private prismaIngredientRepository: IngredientRepositoryInterface
  ) {}

  async run(ingredient: InitialIngredient) {
    return this.prismaIngredientRepository.createIngredientIfNotExisting(
      ingredient.name,
      INGREDIENT_INITIAL_QUANTITY
    );
  }
}
