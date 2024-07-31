/**
 * @jest-environment node
 */

import { clearDatabase } from "@/adapters/prismaClient";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import DecrementIngredientQuantity from "@/use-cases/User/DecrementIngredientQuantity/DecrementIngredientQuantity";

const prismaIngredientRepository = new PrismaIngredientRepository();
const decrementIngredientQuantity = new DecrementIngredientQuantity(
  prismaIngredientRepository
);

describe("DecrementIngredientQuantity", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("when current quantity is 0", () => {
    it("throws exception INGREDIENT_QUANTITY_MUST_BE_AT_LEAST_ZERO", async () => {
      const ingredient =
        await prismaIngredientRepository.client.ingredient.create({
          data: { name: "Basilic", quantity: 0 },
        });

      await expect(
        decrementIngredientQuantity.run(ingredient.id)
      ).rejects.toThrow(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_MUST_BE_AT_LEAST_ZERO
      );
    });
  });

  describe("when current quantity is greater than 0", () => {
    it("updates ingredient with decremented quantity, returns ingredient", async () => {
      const ingredient =
        await prismaIngredientRepository.client.ingredient.create({
          data: { name: "Basilic", quantity: 1 },
        });

      expect(
        await decrementIngredientQuantity.run(ingredient.id)
      ).toMatchObject({
        quantity: 0,
      });
      expect(
        (await prismaIngredientRepository.findIngredientById(ingredient.id))
          .quantity
      ).toEqual(0);
    });
  });
});
