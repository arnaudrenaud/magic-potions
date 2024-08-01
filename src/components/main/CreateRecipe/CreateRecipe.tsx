import { createUserRecipe } from "@/app/api-queries/createUserRecipe";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { getUserFacingErrorMessage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useState } from "react";

export function CreateRecipe({
  onClose,
  onSuccess,
  ingredients,
}: {
  onClose: () => void;
  onSuccess: () => void;
  ingredients: Ingredient[];
}) {
  const [step, setStep] = useState<"alert" | "form">("alert");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const mutationSubmission = useMutation({
    mutationFn: createUserRecipe,
    onSuccess: ({ createdRecipe }) => {
      router.refresh();
      onClose();
      onSuccess();
      toast({
        title: "Potion créée",
        description: `Vous avez créé la ${createdRecipe.name}`,
      });
    },
    onError: ({ message }) => {
      setErrorMessage(getUserFacingErrorMessage(message));
    },
  });

  if (step === "alert") {
    return (
      <AlertDialog open onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cette potion n'existe pas encore
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous la créer ?
              <br />
              Ses ingrédients seront déduits de votre inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button
              onClick={() => {
                setStep("form");
              }}
            >
              Continuer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle potion</DialogTitle>
          <DialogDescription>
            <i>Composition : </i>
            {ingredients.map((ingredient) => ingredient.name).join(", ")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            const name = formData.get("name") as string;
            mutationSubmission.mutate({
              name,
              ingredientIds: ingredients.map(({ id }) => id),
            });
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom:
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                className="col-span-3"
              />
              {errorMessage && (
                <div className="col-span-3 col-start-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutationSubmission.isPending}>
              Valider
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
