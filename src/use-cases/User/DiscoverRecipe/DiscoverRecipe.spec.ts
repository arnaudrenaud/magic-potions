/**
 * @jest-environment node
 */

import { clearDatabase } from "@/adapters/prismaClient";
import { INGREDIENT_INITIAL_QUANTITY } from "@/domain/Ingredient/Ingredient";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import CreateInitialIngredient from "@/use-cases/Admin/CreateInitialIngredient/CreateInitialIngredient";
import CreateOrUpdateInitialRecipe from "@/use-cases/Admin/CreateOrUpdateInitialRecipe/CreateOrUpdateInitialRecipe";
import DiscoverRecipe from "@/use-cases/User/DiscoverRecipe/DiscoverRecipe";

const prismaIngredientRepository = new PrismaIngredientRepository();
const prismaRecipeRepository = new PrismaRecipeRepository();
const createInitialIngredient = new CreateInitialIngredient(
  prismaIngredientRepository
);
const createOrUpdateInitialRecipe = new CreateOrUpdateInitialRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

const discoverRecipe = new DiscoverRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

describe("DiscoverRecipe", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("if less or more than three ingredients are passed", () => {
    it("throws exception RECIPE_MUST_HAVE_THREE_INGREDIENTS", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });

      await expect(discoverRecipe.run([basilic.id, persil.id])).rejects.toThrow(
        RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS.message
      );
    });
  });

  describe("if no recipe with the same ingredients exists", () => {
    it("throws exception RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });

      await expect(
        discoverRecipe.run([basilic.id, persil.id, coriandre.id])
      ).rejects.toThrow(
        RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED.message
      );
    });
  });

  describe("if recipe with the same ingredients exists", () => {
    describe("if already discovered", () => {
      it("throws exception RECIPE_ALREADY_DISCOVERED", async () => {
        const basilic = await createInitialIngredient.run({ name: "Basilic" });
        const persil = await createInitialIngredient.run({ name: "Persil" });
        const coriandre = await createInitialIngredient.run({
          name: "Coriandre",
        });

        const existingRecipe = await createOrUpdateInitialRecipe.run({
          name: "Recette existante",
          ingredientNames: ["Basilic", "Persil", "Coriandre"],
        });
        await prismaRecipeRepository.setRecipeToDiscovered(existingRecipe.id);

        await expect(
          discoverRecipe.run([basilic.id, persil.id, coriandre.id])
        ).rejects.toThrow(RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED.message);
      });
    });

    describe("if not discovered yet", () => {
      it("sets it to discovered, decrements quantity for each ingredient, returns recipe", async () => {
        const basilic = await createInitialIngredient.run({ name: "Basilic" });
        const persil = await createInitialIngredient.run({ name: "Persil" });
        const coriandre = await createInitialIngredient.run({
          name: "Coriandre",
        });

        await createOrUpdateInitialRecipe.run({
          name: "Recette existante",
          ingredientNames: ["Basilic", "Persil", "Coriandre"],
        });

        expect(
          await discoverRecipe.run([basilic.id, persil.id, coriandre.id])
        ).toMatchObject({
          isDiscovered: true,
        });

        expect(
          (
            await prismaIngredientRepository.findIngredientByNameOrThrow(
              "Basilic"
            )
          ).quantity
        ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
        expect(
          (
            await prismaIngredientRepository.findIngredientByNameOrThrow(
              "Persil"
            )
          ).quantity
        ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
        expect(
          (
            await prismaIngredientRepository.findIngredientByNameOrThrow(
              "Coriandre"
            )
          ).quantity
        ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
      });
    });
  });
});
