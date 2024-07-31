import { prismaClient } from "@/adapters/prismaClient";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { IngredientRepositoryInterface } from "@/use-cases/_interfaces/IngredientRepositoryInterface";

export default class PrismaIngredientRepository
  implements IngredientRepositoryInterface
{
  client = prismaClient;

  findIngredients(): Promise<Ingredient[]> {
    return this.client.ingredient.findMany();
  }

  async findIngredientById(id: string): Promise<Ingredient> {
    try {
      return await this.client.ingredient.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      throw new Error(INGREDIENT_EXCEPTIONS.INGREDIENT_NOT_FOUND.message);
    }
  }

  createIngredientIfNotExisting(
    name: string,
    quantity: number
  ): Promise<Ingredient> {
    return this.client.ingredient.upsert({
      where: { name },
      create: { name, quantity },
      update: {},
    });
  }

  async findIngredientByNameOrThrow(name: string): Promise<Ingredient> {
    try {
      return await this.client.ingredient.findUniqueOrThrow({
        where: { name },
      });
    } catch (error) {
      throw new Error(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_MUST_BE_AT_LEAST_ZERO.message
      );
    }
  }

  async decrementIngredientQuantity(id: string): Promise<Ingredient> {
    const currentQuantity = (
      await this.client.ingredient.findUniqueOrThrow({
        where: { id },
      })
    )?.quantity;

    return this.client.ingredient.update({
      where: { id },
      data: { quantity: currentQuantity - 1 },
    });
  }

  async incrementIngredientQuantity(id: string): Promise<Ingredient> {
    const currentQuantity = (
      await this.client.ingredient.findUniqueOrThrow({
        where: { id },
      })
    )?.quantity;

    return this.client.ingredient.update({
      where: { id },
      data: { quantity: currentQuantity + 1 },
    });
  }
}
