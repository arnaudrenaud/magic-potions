export type InitialRecipe = {
  name: string;
  ingredientNames: string[];
};

export const initialRecipes: InitialRecipe[] = [
  {
    name: "Potion d'invisibilité",
    ingredientNames: ["Noix de coco", "Yttrium", "Mandragore"],
  },
  {
    name: "Potion d'amour",
    ingredientNames: ["Bave de lama", "Plume de griffon", "Hélium liquide"],
  },
  {
    name: "Potion de jeunesse",
    ingredientNames: ["Or", "Crin de licorne", "Azote liquide"],
  },
  {
    name: "Potion d'immortalité",
    ingredientNames: ["Poil de yéti", "Jus de Horglup", "Argent"],
  },
  {
    name: "Potion de Clairvoyance",
    ingredientNames: ["Épine de hérisson", "Jus de Horglup", "Noix de coco"],
  },
  {
    name: "Potion de Force",
    ingredientNames: ["Poil de yéti", "Or", "Argent"],
  },
  {
    name: "Potion de Vitesse",
    ingredientNames: ["Hélium liquide", "Plume de griffon", "Azote liquide"],
  },
  {
    name: "Potion de Guérison",
    ingredientNames: ["Crin de licorne", "Mandragore", "Bave de lama"],
  },
  {
    name: "Potion de Transformation",
    ingredientNames: ["Queue d'écureuil", "Yttrium", "Épine de hérisson"],
  },
];
