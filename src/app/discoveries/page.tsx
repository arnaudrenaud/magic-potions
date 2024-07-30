import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import GetRecipes from "@/use-cases/User/GetRecipes/GetRecipes";

const recipeRepository = new PrismaRecipeRepository();
const getRecipes = new GetRecipes(recipeRepository);

export default async function Discoveries() {
  const recipes = await getRecipes.run();

  const initialRecipes = recipes.filter(({ isInitial }) => isInitial);
  const userCreatedRecipes = recipes.filter(({ isInitial }) => !isInitial);

  return (
    <ul className="w-full grid lg:grid-cols-2 gap-8">
      <div className="w-full grid gap-4">
        Potions classiques :
        {initialRecipes.map((recipe) => (
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
      </div>
      <div className="w-full grid gap-4 content-baseline">
        Potions créées :
        {userCreatedRecipes.length ? (
          userCreatedRecipes.map((recipe) => (
            <li
              key={recipe.id}
              className="w-full p-3 rounded bg-secondary grid"
            >
              <div>{recipe.name}</div>
              <div className="text-sm text-muted-foreground">
                {recipe.ingredients.map(({ name }) => name).join(", ")}
              </div>
            </li>
          ))
        ) : (
          <div className="text-muted-foreground italic">
            Aucune recette créée pour l'instant.
          </div>
        )}
      </div>
    </ul>
  );
}
