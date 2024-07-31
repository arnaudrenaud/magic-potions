/**
 * @jest-environment node
 */

import { clearDatabase } from "@/adapters/prismaClient";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import IncrementIngredientQuantity from "@/use-cases/User/IncrementIngredientQuantity/IncrementIngredientQuantity";

const prismaIngredientRepository = new PrismaIngredientRepository();
const incrementIngredientQuantity = new IncrementIngredientQuantity(
  prismaIngredientRepository
);

describe("IncrementIngredientQuantity", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("updates ingredient with incremented quantity, returns ingredient", async () => {
    const ingredient =
      await prismaIngredientRepository.client.ingredient.create({
        data: { name: "Basilic", quantity: 1 },
      });

    expect(await incrementIngredientQuantity.run(ingredient.id)).toMatchObject({
      quantity: 2,
    });
    expect(
      (await prismaIngredientRepository.findIngredientById(ingredient.id))
        .quantity
    ).toEqual(2);
  });
});
