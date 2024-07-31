import { ManageInventory } from "@/components/use-cases/ManageInventory/ManageInventory";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import GetIngredients from "@/use-cases/User/GetIngredients/GetIngredients";

const ingredientrepository = new PrismaIngredientRepository();
const getIngredients = new GetIngredients(ingredientrepository);

export default async function Inventory() {
  const ingredients = await getIngredients.run();

  return <ManageInventory ingredients={ingredients} />;
}
