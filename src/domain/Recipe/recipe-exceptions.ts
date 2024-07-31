export const RECIPE_EXCEPTIONS = {
  RECIPE_MUST_HAVE_A_NAME: { message: "La potion doit avoir un nom" },
  RECIPE_MUST_HAVE_THREE_INGREDIENTS: {
    message: "La potion doit comporter trois ingrédients",
  },
  RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED: {
    message: "La potion doit d'abord être créée",
  },
  RECIPE_ALREADY_DISCOVERED: {
    message: "Cette potion a déjà été découverte",
  },
  RECIPE_WITH_NAME_ALREADY_EXISTS: {
    message: "Une potion avec le même nom existe déjà",
  },
  RECIPE_WITH_SAME_INGREDIENTS_ALREADY_EXISTS: {
    message: "Une potion avec les mêmes ingrédients existe déjà",
  },
};
