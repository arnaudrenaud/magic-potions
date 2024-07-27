import { prismaClient } from "@/adapters/prismaClient";
import { Recipe } from "@/domain/Recipe/Recipe";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";

export default class PrismaRecipeRepository
  implements RecipeRepositoryInterface
{
  client = prismaClient;

  findRecipeByName(name: string): Promise<Recipe | null> {
    return this.client.recipe.findUnique({
      where: {
        name,
      },
    });
  }

  findRecipeByIngredientIds(ingredientIds: string[]): Promise<Recipe | null> {
    return this.client.recipe.findFirst({
      where: {
        ingredientsInRecipe: { every: { ingredientId: { in: ingredientIds } } },
      },
    });
  }

  setRecipeToDiscovered(id: string): Promise<Recipe> {
    return this.client.recipe.update({
      where: { id },
      data: { isDiscovered: true },
    });
  }

  async createRecipe(
    name: string,
    isDiscovered: boolean,
    ingredientIds: string[]
  ): Promise<Recipe> {
    return this.client.recipe.create({
      data: {
        name,
        isDiscovered,
        ingredientsInRecipe: {
          create: ingredientIds.map((ingredientId) => ({
            ingredientId,
          })),
        },
      },
    });
  }

  async updateIngredientsForRecipe(
    recipeId: string,
    ingredientIds: string[]
  ): Promise<Recipe> {
    await this.client.ingredientInRecipe.deleteMany({
      where: { recipeId },
    });
    return this.client.recipe.update({
      where: { id: recipeId },
      data: {
        ingredientsInRecipe: {
          create: ingredientIds.map((ingredientId) => ({
            ingredientId,
          })),
        },
      },
    });
  }
}
