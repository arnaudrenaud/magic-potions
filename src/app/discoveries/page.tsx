import PrismaRecipeRepository from "@/infrastructure/repositories/prisma/PrismaRecipeRepository";
import GetRecipes from "@/use-cases/User/GetRecipes/GetRecipes";

const recipeRepository = new PrismaRecipeRepository();
const getRecipes = new GetRecipes(recipeRepository);

export default async function Discoveries() {
  const recipes = await getRecipes.run();

  const initialRecipes = recipes.filter(({ isInitial }) => isInitial);
  const userCreatedRecipes = recipes.filter(({ isInitial }) => !isInitial);

  return (
    <main className="w-full grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>Potions classiques :</div>
        <ul className="w-full grid gap-4">
          {initialRecipes.map((recipe) => (
            <li
              key={recipe.id}
              className="w-full p-3 rounded bg-secondary grid"
            >
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
      </div>
      <div className="space-y-4">
        <div>Potions créées :</div>
        {userCreatedRecipes.length ? (
          <ul className="w-full grid gap-4">
            {userCreatedRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="w-full p-3 rounded bg-secondary grid"
              >
                <div>{recipe.name}</div>
                <div className="text-sm text-muted-foreground">
                  {recipe.ingredients.map(({ name }) => name).join(", ")}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground italic">
            Aucune potion créée pour l'instant.
          </div>
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: `Découvertes • Magic Potions`,
};
