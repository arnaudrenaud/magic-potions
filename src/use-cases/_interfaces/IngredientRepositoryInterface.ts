import { Ingredient } from "@prisma/client";

export interface IngredientRepositoryInterface {
  createIngredientIfNotExisting(
    name: string,
    quantity: number
  ): Promise<Ingredient>;
  findIngredientByNameOrThrow(name: string): Promise<Ingredient>;
  decrementIngredientQuantity(id: string): Promise<Ingredient>;
}
