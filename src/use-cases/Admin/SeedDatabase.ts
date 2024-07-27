import { clearDatabase, prismaClient } from "@/adapters/prismaClient";
import { initialIngredients } from "@/domain/constants/initial-ingredients";
import { initialRecipes } from "@/domain/Recipe/initial-recipes";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import CreateInitialIngredient from "@/use-cases/Admin/CreateInitialIngredient/CreateInitialIngredient";
import CreateOrUpdateInitialRecipe from "@/use-cases/Admin/CreateOrUpdateInitialRecipe/CreateOrUpdateInitialRecipe";

async function main() {
  await clearDatabase();

  const prismaIngredientRepository = new PrismaIngredientRepository();
  const prismaRecipeRepository = new PrismaRecipeRepository();
  const createInitialIngredient = new CreateInitialIngredient(
    prismaIngredientRepository
  );
  const createOrUpdateInitialRecipe = new CreateOrUpdateInitialRecipe(
    prismaRecipeRepository,
    prismaIngredientRepository
  );

  for (const ingredient of initialIngredients) {
    await createInitialIngredient.run(ingredient);
  }

  for (const recipe of initialRecipes) {
    await createOrUpdateInitialRecipe.run(recipe);
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
