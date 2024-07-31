import { handleError } from "@/app/api/utils";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import DecrementIngredientQuantity from "@/use-cases/User/DecrementIngredientQuantity/DecrementIngredientQuantity";
import IncrementIngredientQuantity from "@/use-cases/User/IncrementIngredientQuantity/IncrementIngredientQuantity";

enum ActionType {
  DECREMENT = "decrement",
  INCREMENT = "increment",
}

const prismaIngredientRepository = new PrismaIngredientRepository();
const decrementIngredientQuantity = new DecrementIngredientQuantity(
  prismaIngredientRepository
);
const incrementIngredientQuantity = new IncrementIngredientQuantity(
  prismaIngredientRepository
);

export const PATCH = handleError(
  async (
    request: Request,
    { params: { ingredientId } }: { params: { ingredientId: string } }
  ) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case ActionType.DECREMENT:
        return Response.json({
          updatedIngredient: await decrementIngredientQuantity.run(
            ingredientId
          ),
        });

      case ActionType.INCREMENT:
        return Response.json({
          updatedIngredient: await incrementIngredientQuantity.run(
            ingredientId
          ),
        });

      default:
        return Response.json(
          {
            errorMessage:
              "Query param 'action' must be set to 'decrement' or 'increment'",
          },
          { status: 400 }
        );
    }
  }
);
