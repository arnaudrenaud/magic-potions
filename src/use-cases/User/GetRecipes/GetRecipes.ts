import { Recipe, RecipeWithIngredients } from "@/domain/Recipe/Recipe";
import { RecipeRepositoryInterface } from "@/use-cases/_interfaces/RecipeRepositoryInterface";

export default class GetRecipes {
  constructor(private recipeRepository: RecipeRepositoryInterface) {}

  run(): Promise<(Recipe & RecipeWithIngredients)[]> {
    return this.recipeRepository.findRecipesWithIngredients();
  }
}
