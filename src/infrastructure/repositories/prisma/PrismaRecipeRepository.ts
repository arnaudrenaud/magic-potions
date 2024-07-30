import { prismaClient } from "@/adapters/prismaClient";
import { Recipe, RecipeWithIngredients } from "@/domain/Recipe/Recipe";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";

export default class PrismaRecipeRepository
  implements RecipeRepositoryInterface
{
  client = prismaClient;

  async findRecipesWithIngredients(): Promise<
    (Recipe & RecipeWithIngredients)[]
  > {
    const recipes = await this.client.recipe.findMany({
      include: {
        ingredientsInRecipe: {
          include: {
            ingredient: { select: { id: true, name: true, quantity: true } },
          },
        },
      },
    });
    return recipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredientsInRecipe.map((ingredientInRecipe) => ({
        ...ingredientInRecipe.ingredient,
      })),
    }));
  }

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

  async createRecipe({
    name,
    isDiscovered,
    isInitial,
    ingredientIds,
  }: {
    name: string;
    isDiscovered: boolean;
    isInitial?: boolean;
    ingredientIds: string[];
  }): Promise<Recipe> {
    return this.client.recipe.create({
      data: {
        name,
        isDiscovered,
        ...(isInitial && { isInitial }),
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
