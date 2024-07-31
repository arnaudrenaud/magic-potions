import { SelectIngredients } from "@/components/use-cases/SelectIngredients/SelectIngredients";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import GetIngredients from "@/use-cases/User/GetIngredients/GetIngredients";

const ingredientrepository = new PrismaIngredientRepository();
const getIngredients = new GetIngredients(ingredientrepository);

export default async function Home() {
  const ingredients = await getIngredients.run();

  return <SelectIngredients ingredients={ingredients} />;
}

export const metadata = {
  title: `Composition • Magic Potions`,
};
