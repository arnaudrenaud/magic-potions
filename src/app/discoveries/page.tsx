import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import GetRecipes from "@/use-cases/User/GetRecipes/GetRecipes";

const recipeRepository = new PrismaRecipeRepository();
const getRecipes = new GetRecipes(recipeRepository);

export default async function Discoveries() {
  const recipes = await getRecipes.run();

  return (
    <ul className="w-full grid gap-4">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="w-full p-3 rounded bg-secondary grid">
          {recipe.isDiscovered ? (
            <>
              <div>{recipe.name}</div>
              <div className="text-sm text-muted-foreground">
                {recipe.ingredients.map(({ name }) => name).join(", ")}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground italic">À découvrir…</div>
          )}
        </li>
      ))}
    </ul>
  );
}
