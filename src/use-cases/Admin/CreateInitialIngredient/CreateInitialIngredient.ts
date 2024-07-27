import { InitialIngredient } from "@/domain/constants/initial-ingredients";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class CreateInitialIngredient {
  constructor(
    private prismaIngredientRepository: IngredientRepositoryInterface
  ) {}

  async run(ingredient: InitialIngredient) {
    return this.prismaIngredientRepository.createIngredientIfNotExisting(
      ingredient.name,
      1
    );
  }
}
