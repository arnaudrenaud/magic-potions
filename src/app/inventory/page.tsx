import { ManageInventory } from "@/components/use-cases/ManageInventory/ManageInventory";
import PrismaIngredientRepository from "@/infrastructure/repositories/prisma/PrismaIngredientRepository";
import GetIngredients from "@/use-cases/User/GetIngredients/GetIngredients";

const ingredientrepository = new PrismaIngredientRepository();
const getIngredients = new GetIngredients(ingredientrepository);

export const dynamic = "force-dynamic";
export default async function Inventory() {
  const ingredients = await getIngredients.run();

  return <ManageInventory ingredients={ingredients} />;
}

export const metadata = {
  title: `Inventaire • Magic Potions`,
};
