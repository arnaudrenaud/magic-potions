/**
 * @jest-environment node
 */

import { clearDatabase } from "@/adapters/prismaClient";
import { INGREDIENT_INITIAL_QUANTITY } from "@/domain/Ingredient/Ingredient";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import CreateInitialIngredient from "@/use-cases/Admin/CreateInitialIngredient/CreateInitialIngredient";
import CreateOrUpdateInitialRecipe from "@/use-cases/Admin/CreateOrUpdateInitialRecipe/CreateOrUpdateInitialRecipe";
import CreateUserRecipe from "@/use-cases/User/CreateUserRecipe/CreateUserRecipe";

const prismaIngredientRepository = new PrismaIngredientRepository();
const prismaRecipeRepository = new PrismaRecipeRepository();
const createInitialIngredient = new CreateInitialIngredient(
  prismaIngredientRepository
);
const createOrUpdateInitialRecipe = new CreateOrUpdateInitialRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

const createUserRecipe = new CreateUserRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

describe("CreateUserRecipe", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("if recipe is not valid", () => {
    it("throws exception", async () => {
      await expect(createUserRecipe.run("", [])).rejects.toThrow(
        RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_A_NAME
      );
    });
  });

  describe("if some ingredients have no quantity left", () => {
    it("throws exception INGREDIENT_QUANTITY_INSUFFICIENT_FOR_RECIPE", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });

      await prismaIngredientRepository.client.ingredient.update({
        where: { id: basilic.id },
        data: { quantity: 0 },
      });

      await expect(
        createUserRecipe.run("Nom", [basilic.id, persil.id, coriandre.id])
      ).rejects.toThrow(
        INGREDIENT_EXCEPTIONS.INGREDIENT_QUANTITY_INSUFFICIENT_FOR_RECIPE
      );
    });
  });

  describe("if recipe with the same name already exists", () => {
    it("throws error RECIPE_WITH_NAME_ALREADY_EXISTS", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });
      await createInitialIngredient.run({
        name: "Menthe",
      });
      await createOrUpdateInitialRecipe.run({
        name: "Nom de la recette existante",
        ingredientNames: ["Basilic", "Persil", "Coriandre"],
      });

      await expect(
        createUserRecipe.run("Nom de la recette existante", [
          basilic.id,
          persil.id,
          coriandre.id,
        ])
      ).rejects.toThrow(RECIPE_EXCEPTIONS.RECIPE_WITH_NAME_ALREADY_EXISTS);
    });
  });

  describe("if recipe with a different name and the same ingredients exists", () => {
    it("throws error RECIPE_WITH_INGREDIENTS_ALREADY_EXISTS", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });
      await createOrUpdateInitialRecipe.run({
        name: "Nom de la recette existante",
        ingredientNames: ["Basilic", "Persil", "Coriandre"],
      });

      await expect(
        createUserRecipe.run("Nouveau nom", [
          coriandre.id,
          basilic.id,
          persil.id,
        ])
      ).rejects.toThrow(
        RECIPE_EXCEPTIONS.RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS
      );
    });
  });

  describe("if no recipe with the same ingredients already exists", () => {
    it("creates recipe, sets it to discovered, decrements quantity for each ingredient, returns recipe", async () => {
      const basilic = await createInitialIngredient.run({ name: "Basilic" });
      const persil = await createInitialIngredient.run({ name: "Persil" });
      const coriandre = await createInitialIngredient.run({
        name: "Coriandre",
      });

      const menthe = await createInitialIngredient.run({
        name: "Menthe",
      });

      await createOrUpdateInitialRecipe.run({
        name: "Recette existant",
        ingredientNames: ["Basilic", "Persil", "Coriandre"],
      });

      const createdRecipe = await createUserRecipe.run("Nouvelle recette", [
        coriandre.id,
        basilic.id,
        menthe.id,
      ]);
      expect(createdRecipe).toEqual(
        await prismaRecipeRepository.findRecipeByName("Nouvelle recette")
      );

      expect(createdRecipe.isDiscovered).toEqual(true);
      expect(createdRecipe.isInitial).toEqual(false);

      expect(
        (
          await prismaIngredientRepository.findIngredientByNameOrThrow(
            "Coriandre"
          )
        ).quantity
      ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
      expect(
        (
          await prismaIngredientRepository.findIngredientByNameOrThrow(
            "Basilic"
          )
        ).quantity
      ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
      expect(
        (await prismaIngredientRepository.findIngredientByNameOrThrow("Menthe"))
          .quantity
      ).toEqual(INGREDIENT_INITIAL_QUANTITY - 1);
      expect(
        (await prismaIngredientRepository.findIngredientByNameOrThrow("Persil"))
          .quantity
      ).toEqual(INGREDIENT_INITIAL_QUANTITY);
    });
  });
});
