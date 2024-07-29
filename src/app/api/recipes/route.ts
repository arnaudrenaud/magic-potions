import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import { getErrorMessage } from "@/lib/utils";
import CreateUserRecipe from "@/use-cases/User/CreateUserRecipe/CreateUserRecipe";
import DiscoverRecipe from "@/use-cases/User/DiscoverRecipe/DiscoverRecipe";
import { z } from "zod";

enum ActionType {
  DISCOVER = "discover",
  CREATE = "create",
}

const DiscoverRecipeArguments = z.object({
  ingredientIds: z.string().array(),
});

const CreateUserRecipeArguments = z.object({
  name: z.string(),
  ingredientIds: z.string().array(),
});

const prismaRecipeRepository = new PrismaRecipeRepository();
const prismaIngredientRepository = new PrismaIngredientRepository();
const discoverRecipe = new DiscoverRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);
const createUserRecipe = new CreateUserRecipe(
  prismaRecipeRepository,
  prismaIngredientRepository
);

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case ActionType.DISCOVER:
      const discoverQuery = DiscoverRecipeArguments.safeParse(
        await request.json()
      );

      if (discoverQuery.error) {
        return Response.json(
          {
            errorMessage: discoverQuery.error,
          },
          { status: 400 }
        );
      }

      try {
        return Response.json({
          discoveredRecipe: await discoverRecipe.run(
            discoverQuery.data.ingredientIds
          ),
        });
      } catch (error) {
        return Response.json(
          { errorMessage: getErrorMessage(error) },
          { status: 400 }
        );
      }

    case ActionType.CREATE:
      const createQuery = CreateUserRecipeArguments.safeParse(
        await request.json()
      );

      if (createQuery.error) {
        return Response.json(
          {
            errorMessage: createQuery.error,
          },
          { status: 400 }
        );
      }

      try {
        return Response.json({
          createdRecipe: await createUserRecipe.run(
            createQuery.data.name,
            createQuery.data.ingredientIds
          ),
        });
      } catch (error) {
        return Response.json(
          { errorMessage: getErrorMessage(error) },
          { status: 400 }
        );
      }

    default:
      return Response.json(
        {
          errorMessage:
            "Query param 'action' must be set to 'discover' or 'create'",
        },
        { status: 400 }
      );
  }
}
