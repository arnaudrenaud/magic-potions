import { Ingredient } from "@/domain/entities/Ingredient";

export type Recipe = {
  id: string;
  name: string;
  ingredients: Ingredient[];
  isDiscovered: boolean;
};
