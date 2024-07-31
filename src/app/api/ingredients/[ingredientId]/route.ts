import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import { getErrorMessage } from "@/lib/utils";
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

export async function PATCH(
  request: Request,
  { params: { ingredientId } }: { params: { ingredientId: string } }
) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case ActionType.DECREMENT:
      try {
        return Response.json({
          updatedIngredient: await decrementIngredientQuantity.run(
            ingredientId
          ),
        });
      } catch (error) {
        return Response.json(
          { errorMessage: getErrorMessage(error) },
          { status: 400 }
        );
      }

    case ActionType.INCREMENT:
      try {
        return Response.json({
          updatedIngredient: await incrementIngredientQuantity.run(
            ingredientId
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
            "Query param 'action' must be set to 'decrement' or 'increment'",
        },
        { status: 400 }
      );
  }
}
