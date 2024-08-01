import { ManageInventory } from "@/components/main/ManageInventory/ManageInventory";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { INGREDIENT_EXCEPTIONS } from "@/domain/Ingredient/ingredient-exceptions";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockDecrementIngredientQuantity = jest.fn();
const mockIncrementIngredientQuantity = jest.fn();
const mockRouterRefresh = jest.fn();
const mockToast = jest.fn();

jest.mock("../../../app/api-queries/decrementIngredientQuantity", () => ({
  decrementIngredientQuantity: (args: any) =>
    mockDecrementIngredientQuantity(args),
}));
jest.mock("../../../app/api-queries/incrementIngredientQuantity", () => ({
  incrementIngredientQuantity: (args: any) =>
    mockIncrementIngredientQuantity(args),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}));
jest.mock("../../ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("ManageInventory", () => {
  describe("when an ingredient has quantity 0", () => {
    it("displays disabled button '-'", async () => {
      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <ManageInventory
            ingredients={[{ id: "id-argent", name: "Argent", quantity: 0 }]}
          />
        </ReactQueryProvider>
      );

      expect(screen.getByText("-")).toBeDisabled();
    });
  });

  describe("when clicking button '-' and server responds with error", () => {
    it("shows toast message with error", async () => {
      mockDecrementIngredientQuantity.mockRejectedValue(
        new Error("Server unreachable")
      );

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <ManageInventory
            ingredients={[{ id: "id-argent", name: "Argent", quantity: 2 }]}
          />
        </ReactQueryProvider>
      );

      await user.click(screen.getByText("-"));

      await waitFor(() => {
        expect(mockDecrementIngredientQuantity).toHaveBeenCalledWith(
          "id-argent"
        );
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: "destructive",
          title: "Erreur",
          description: "Server unreachable",
        });
      });
    });
  });

  describe("when clicking button '-' and server responds with success", () => {
    it("refreshes data", async () => {
      mockDecrementIngredientQuantity.mockResolvedValue({
        updatedIngredient: { id: "id-argent", name: "Argent", quantity: 1 },
      });

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <ManageInventory
            ingredients={[{ id: "id-argent", name: "Argent", quantity: 2 }]}
          />
        </ReactQueryProvider>
      );

      await user.click(screen.getByText("-"));

      await waitFor(() => {
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });
  });

  describe("when clicking button '+' and server responds with error", () => {
    it("shows toast message with error", async () => {
      mockIncrementIngredientQuantity.mockRejectedValue(
        new Error("Server unreachable")
      );

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <ManageInventory
            ingredients={[{ id: "id-argent", name: "Argent", quantity: 2 }]}
          />
        </ReactQueryProvider>
      );

      await user.click(screen.getByText("+"));

      await waitFor(() => {
        expect(mockIncrementIngredientQuantity).toHaveBeenCalledWith(
          "id-argent"
        );
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: "destructive",
          title: "Erreur",
          description: "Server unreachable",
        });
      });
    });
  });

  describe("when clicking button '+' and server responds with success", () => {
    it("refreshes data", async () => {
      mockIncrementIngredientQuantity.mockResolvedValue({
        updatedIngredient: { id: "id-argent", name: "Argent", quantity: 3 },
      });

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <ManageInventory
            ingredients={[{ id: "id-argent", name: "Argent", quantity: 2 }]}
          />
        </ReactQueryProvider>
      );

      await user.click(screen.getByText("+"));

      await waitFor(() => {
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });
  });
});
