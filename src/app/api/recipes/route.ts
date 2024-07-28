import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import { getErrorMessage } from "@/lib/utils";
import DiscoverRecipe from "@/use-cases/User/DiscoverRecipe/DiscoverRecipe";
import { z } from "zod";

const prismaRecipeRepository = new PrismaRecipeRepository();
const prismaIngredientRepository = new PrismaIngredientRepository();
const discoverRecipe = new DiscoverRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

const DiscoverRecipeArguments = z.object({
  ingredientIds: z.string().array(),
});

export async function POST(request: Request) {
  const query = DiscoverRecipeArguments.safeParse(await request.json());

  if (query.error) {
    return Response.json(
      {
        errorMessage: query.error,
      },
      { status: 400 }
    );
  }

  try {
    return Response.json({
      discoveredRecipe: await discoverRecipe.run(query.data.ingredientIds),
    });
  } catch (error) {
    return Response.json(
      { errorMessage: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
