import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import GetIngredients from "@/use-cases/User/GetIngredients/GetIngredients";
import { SelectIngredients } from "@/components/use-cases/SelectIngredients";

const ingredientrepository = new PrismaIngredientRepository();
const getIngredients = new GetIngredients(ingredientrepository);

export default async function Home() {
  const ingredients = await getIngredients.run();

  return <SelectIngredients ingredients={ingredients} />;
}
