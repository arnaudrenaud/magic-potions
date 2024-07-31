import { Ingredient } from "@prisma/client";

export interface IngredientRepositoryInterface {
  findIngredients(): Promise<Ingredient[]>;
  findIngredientById(id: string): Promise<Ingredient>;
  createIngredientIfNotExisting(
    name: string,
    quantity: number
  ): Promise<Ingredient>;
  findIngredientByNameOrThrow(name: string): Promise<Ingredient>;
  decrementIngredientQuantity(id: string): Promise<Ingredient>;
  incrementIngredientQuantity(id: string): Promise<Ingredient>;
}
