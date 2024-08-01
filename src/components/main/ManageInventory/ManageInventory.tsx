"use client";

import { decrementIngredientQuantity } from "@/app/api-queries/decrementIngredientQuantity";
import { incrementIngredientQuantity } from "@/app/api-queries/incrementIngredientQuantity";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { cn, getUserFacingErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function ManageInventory({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const { toast } = useToast();
  const router = useRouter();

  const decrementMutation = useMutation({
    mutationFn: decrementIngredientQuantity,
    onSuccess: () => {
      router.refresh();
    },
    onError: ({ message }) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: getUserFacingErrorMessage(message),
      });
    },
  });

  const incrementMutation = useMutation({
    mutationFn: incrementIngredientQuantity,
    onSuccess: () => {
      router.refresh();
    },
    onError: ({ message }) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    },
  });

  return (
    <main className="w-full space-y-4">
      <div>Ajustez la quantité disponible pour chaque ingrédient :</div>

      <ul className="grid lg:grid-cols-2 gap-4">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="w-full p-3 rounded bg-secondary flex justify-between items-center"
          >
            {ingredient.name}
            <div className="flex gap-4 items-center">
              <Button
                title="Retirer une unité"
                variant="ghost"
                onClick={() => {
                  decrementMutation.mutate(ingredient.id);
                }}
                disabled={!ingredient.quantity}
                className="hover:bg-primary"
              >
                -
              </Button>
              <div
                className={cn(
                  "w-[1.5rem] text-center",
                  !ingredient.quantity ? "text-destructive" : ""
                )}
              >
                {ingredient.quantity}
              </div>
              <Button
                title="Ajouter une unité"
                variant="ghost"
                onClick={() => {
                  incrementMutation.mutate(ingredient.id);
                }}
                className="hover:bg-primary"
              >
                +
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
