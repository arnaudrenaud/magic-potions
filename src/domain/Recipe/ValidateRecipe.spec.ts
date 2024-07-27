import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { ValidateRecipe } from "@/domain/Recipe/ValidateRecipe";

describe("ValidateRecipe", () => {
  const validateRecipe = new ValidateRecipe();

  describe("if name is empty", () => {
    it("throws exception RECIPE_MUST_HAVE_A_NAME", () => {
      expect(() => {
        validateRecipe.run("", 3);
      }).toThrow(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_A_NAME.message);
    });
  });

  describe("if recipe does not have three ingredients", () => {
    it("throws exception RECIPE_MUST_HAVE_THREE_INGREDIENTS", () => {
      expect(() => {
        validateRecipe.run("Philtre", 2);
      }).toThrow(RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS.message);
    });
  });

  describe("if recipe has a non-empty name and three ingredients", () => {
    it("does not throw", () => {
      expect(validateRecipe.run("Philtre", 3)).toEqual(undefined);
    });
  });
});
