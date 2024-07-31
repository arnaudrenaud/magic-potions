/**
 * @jest-environment node
 */

import { clearDatabase } from "@/adapters/prismaClient";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import CreateInitialIngredient from "@/use-cases/Admin/CreateInitialIngredient/CreateInitialIngredient";
import CreateOrUpdateInitialRecipe from "@/use-cases/Admin/CreateOrUpdateInitialRecipe/CreateOrUpdateInitialRecipe";

const prismaIngredientRepository = new PrismaIngredientRepository();
const prismaRecipeRepository = new PrismaRecipeRepository();
const createInitialIngredient = new CreateInitialIngredient(
  prismaIngredientRepository
);

const createOrUpdateInitialRecipe = new CreateOrUpdateInitialRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

describe("CreateOrUpdateInitialRecipe", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("if some ingredient not found in repository", () => {
    it("throws exception", async () => {
      await expect(
        createOrUpdateInitialRecipe.run({
          name: "Nouvelle recette",
          ingredientNames: ["Inconnu au bataillon", "Autre", "Autre"],
        })
      ).rejects.toThrow(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_MUST_BE_AT_LEAST_ZERO
      );
    });
  });

  describe("if recipe is not valid", () => {
    it("throws exception", async () => {
      await expect(
        createOrUpdateInitialRecipe.run({ name: "", ingredientNames: [] })
      ).rejects.toThrow(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_A_NAME);
    });
  });

  describe("if a recipe with the same name and ingredients exists", () => {
    it("returns existing recipe without updating it", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });

      const existingRecipe = await prismaRecipeRepository.client.recipe.create({
        data: {
          name: "Mélange d'herbes",
          isDiscovered: false,
          isInitial: true,
          ingredientsInRecipe: {
            create: [
              { ingredientId: basilic.id },
              { ingredientId: persil.id },
              { ingredientId: coriandre.id },
            ],
          },
        },
      });

      await createOrUpdateInitialRecipe.run({
        name: "Mélange d'herbes",
        ingredientNames: ["Basilic", "Persil", "Coriandre"],
      });

      expect(await prismaRecipeRepository.client.recipe.count()).toEqual(1);
      expect(
        await prismaRecipeRepository.client.recipe.findUnique({
          where: { id: existingRecipe.id },
        })
      ).toEqual(existingRecipe);
      expect(
        (
          await prismaRecipeRepository.client.ingredientInRecipe.findMany({
            where: {
              recipeId: existingRecipe.id,
            },
          })
        ).map((ingredientInRecipe) => ingredientInRecipe.ingredientId)
      ).toEqual([basilic.id, persil.id, coriandre.id]);
    });

    describe("if recipe with the same name and different ingredients exists", () => {
      it("updates existing recipe with ingredients, returns recipe", async () => {
        const basilic = await createInitialIngredient.run({ name: "Basilic" });
        const persil = await createInitialIngredient.run({ name: "Persil" });
        const coriandre = await createInitialIngredient.run({
          name: "Coriandre",
        });

        const existingRecipe =
          await prismaRecipeRepository.client.recipe.create({
            data: {
              name: "Mélange d'herbes",
              isDiscovered: false,
              ingredientsInRecipe: {
                create: [
                  { ingredientId: basilic.id },
                  { ingredientId: persil.id },
                  { ingredientId: coriandre.id },
                ],
              },
            },
          });

        const origan = await createInitialIngredient.run({ name: "Origan" });
        await createOrUpdateInitialRecipe.run({
          name: "Mélange d'herbes",
          ingredientNames: ["Basilic", "Persil", "Origan"],
        });

        expect(await prismaRecipeRepository.client.recipe.count()).toEqual(1);
        expect(
          (
            await prismaRecipeRepository.client.ingredientInRecipe.findMany({
              where: {
                recipeId: existingRecipe.id,
              },
            })
          ).map((ingredientInRecipe) => ingredientInRecipe.ingredientId)
        ).toEqual([basilic.id, persil.id, origan.id]);
      });
    });
  });

  describe("if recipe with a different name and the same ingredients exists", () => {
    it("throws error RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });

      await prismaRecipeRepository.client.recipe.create({
        data: {
          name: "Mélange d'herbes",
          isDiscovered: false,
          ingredientsInRecipe: {
            create: [
              { ingredientId: basilic.id },
              { ingredientId: persil.id },
              { ingredientId: coriandre.id },
            ],
          },
        },
      });

      await expect(
        createOrUpdateInitialRecipe.run({
          name: "Nouveau nom, même recette",
          ingredientNames: ["Basilic", "Persil", "Coriandre"],
        })
      ).rejects.toThrow(
        RECIPE_EXCEPTIONS.RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS
      );
    });

    describe("if no recipe with the same name or the same ingredients exists", () => {
      it("creates recipe", async () => {
        await createInitialIngredient.run({ name: "Basilic" });
        await createInitialIngredient.run({ name: "Persil" });
        await createInitialIngredient.run({ name: "Coriandre" });

        expect(
          await createOrUpdateInitialRecipe.run({
            name: "Nouveau nom",
            ingredientNames: ["Basilic", "Persil", "Coriandre"],
          })
        ).toMatchObject({
          name: "Nouveau nom",
          isDiscovered: false,
          isInitial: true,
        });
      });
    });
  });
});
