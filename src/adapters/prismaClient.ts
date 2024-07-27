import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export { prismaClient };

export async function clearDatabase() {
  await prismaClient.ingredientInRecipe.deleteMany();
  await prismaClient.recipe.deleteMany();
  await prismaClient.ingredient.deleteMany();
}
