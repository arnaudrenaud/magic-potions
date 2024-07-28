import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import GetIngredients from "@/use-cases/User/GetIngredients/GetIngredients";
import {
  SelectIngredients,
  SelectIngredientsResponse,
} from "@/components/use-cases/SelectIngredients";
import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import DiscoverRecipe from "@/use-cases/User/DiscoverRecipe/DiscoverRecipe";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

const ingredientrepository = new PrismaIngredientRepository();
const getIngredients = new GetIngredients(ingredientrepository);

const prismaRecipeRepository = new PrismaRecipeRepository();
const discoverRecipe = new DiscoverRecipe(
  prismaRecipeRepository,
  ingredientrepository
);

export default async function Home() {
  const ingredients = await getIngredients.run();

  const submitIngredients = async (
    ingredientIds: string[]
  ): Promise<SelectIngredientsResponse> => {
    "use server";

    try {
      const discoveredRecipe = await discoverRecipe.run(ingredientIds);
      revalidatePath("/");
      return {
        discoveredRecipe,
      };
    } catch (error) {
      return {
        errorMessage: getErrorMessage(error),
      };
    }
  };

  return (
    <SelectIngredients ingredients={ingredients} onSubmit={submitIngredients} />
  );
}
