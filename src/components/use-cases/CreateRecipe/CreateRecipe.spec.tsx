import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { CreateRecipe } from "@/components/use-cases/CreateRecipe/CreateRecipe";
import { Ingredient } from "@/domain/Ingredient/Ingredient";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockCreateUserRecipe = jest.fn();
const mockRouterRefresh = jest.fn();
const mockToast = jest.fn();

jest.mock("../../../app/api-queries/createUserRecipe", () => ({
  createUserRecipe: (args: any) => mockCreateUserRecipe(args),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}));
jest.mock("../../ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("CreateRecipe", () => {
  describe("when clicking cancel button", () => {
    it("closes modal", async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <CreateRecipe
            onClose={onClose}
            onSuccess={onSuccess}
            ingredients={[]}
          />
        </ReactQueryProvider>
      );
      await user.click(screen.getByText("Annuler"));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("when clicking continue button", () => {
    it("keeps modal open, shows form with ingredients", async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      const ingredients: Ingredient[] = [
        { id: "0", name: "Argent", quantity: 5 },
        { id: "1", name: "Bave de lama", quantity: 5 },
        { id: "2", name: "Épine de hérisson", quantity: 5 },
      ];

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <CreateRecipe
            onClose={onClose}
            onSuccess={onSuccess}
            ingredients={ingredients}
          />
        </ReactQueryProvider>
      );
      await user.click(screen.getByText("Continuer"));

      expect(onClose).toHaveBeenCalledTimes(0);
      await waitFor(() => {
        expect(
          screen.getByText("Créer une nouvelle potion")
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.getByText("Argent, Bave de lama, Épine de hérisson")
        ).toBeInTheDocument();
      });
    });
  });

  describe("when submitting form and server responds with success", () => {
    it("closes modal, shows toast message with created recipe, calls onSuccess", async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();
      mockCreateUserRecipe.mockResolvedValue({
        createdRecipe: {
          id: "1",
          name: "Nouvelle potion",
          isDiscovered: true,
        },
      });

      const ingredients: Ingredient[] = [
        { id: "0", name: "Argent", quantity: 5 },
        { id: "1", name: "Bave de lama", quantity: 5 },
        { id: "2", name: "Épine de hérisson", quantity: 5 },
      ];

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <CreateRecipe
            onClose={onClose}
            onSuccess={onSuccess}
            ingredients={ingredients}
          />
        </ReactQueryProvider>
      );
      await user.click(screen.getByText("Continuer"));

      await user.type(screen.getByRole("textbox"), "Nouvelle potion");
      await user.click(screen.getByText("Valider"));

      await waitFor(() => {
        expect(mockCreateUserRecipe).toHaveBeenCalledWith({
          name: "Nouvelle potion",
          ingredientIds: ["0", "1", "2"],
        });
      });
      await waitFor(() => {
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Potion créée",
          description: "Vous avez créé la Nouvelle potion",
        });
      });
    });
  });

  describe("when submitting form and server responds with error", () => {
    it("keeps modal open, shows error in form", async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();
      mockCreateUserRecipe.mockRejectedValue(
        new Error(RECIPE_EXCEPTIONS.RECIPE_WITH_NAME_ALREADY_EXISTS.message)
      );

      const ingredients: Ingredient[] = [
        { id: "0", name: "Argent", quantity: 5 },
        { id: "1", name: "Bave de lama", quantity: 5 },
        { id: "2", name: "Épine de hérisson", quantity: 5 },
      ];

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <CreateRecipe
            onClose={onClose}
            onSuccess={onSuccess}
            ingredients={ingredients}
          />
        </ReactQueryProvider>
      );
      await user.click(screen.getByText("Continuer"));

      await user.type(screen.getByRole("textbox"), "Nouvelle potion");
      await user.click(screen.getByText("Valider"));

      await waitFor(() => {
        expect(onClose).not.toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(
          screen.getByText(
            RECIPE_EXCEPTIONS.RECIPE_WITH_NAME_ALREADY_EXISTS.message
          )
        ).toBeInTheDocument();
      });
    });
  });
});
