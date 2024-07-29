import ResizeObserver from "resize-observer-polyfill";

import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RECIPE_EXCEPTIONS } from "@/domain/Recipe/recipe-exceptions";
import { SelectIngredients } from "@/components/use-cases/SelectIngredients/SelectIngredients";

global.ResizeObserver = ResizeObserver;

const mockDiscoverRecipe = jest.fn();
const mockRouterRefresh = jest.fn();
const mockToast = jest.fn();

jest.mock("../../../app/api-queries/discoverRecipe", () => ({
  discoverRecipe: (args: any) => mockDiscoverRecipe(args),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}));
jest.mock("../../ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("SelectIngredients", () => {
  describe("when submitting form and server responds with success", () => {
    it("refreshes data and shows toast message with discovered recipe", async () => {
      mockDiscoverRecipe.mockResolvedValue({
        discoveredRecipe: {
          id: "1",
          name: "Potion existante",
          isDiscovered: true,
        },
      });

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <SelectIngredients
            ingredients={[
              { id: "0", name: "Argent", quantity: 5 },
              { id: "1", name: "Bave de lama", quantity: 5 },
              { id: "2", name: "Épine de hérisson", quantity: 5 },
              { id: "3", name: "Plume de griffon", quantity: 5 },
            ]}
          />
        </ReactQueryProvider>
      );

      user.click(screen.getAllByRole("checkbox")[0]);
      user.click(screen.getAllByRole("checkbox")[1]);
      user.click(screen.getAllByRole("checkbox")[2]);
      user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockDiscoverRecipe).toHaveBeenCalledWith(["0", "1", "2"]);
      });
      await waitFor(() => {
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Bravo !",
          description: "Vous avez découvert la Potion existante.",
        });
      });
    });
  });

  describe("when submitting form and server responds with exception RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED", () => {
    it("shows dialog to ask user if they want to create new recipe", async () => {
      mockDiscoverRecipe.mockRejectedValue(
        new Error(
          RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED.message
        )
      );

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <SelectIngredients
            ingredients={[
              { id: "0", name: "Argent", quantity: 5 },
              { id: "1", name: "Bave de lama", quantity: 5 },
              { id: "2", name: "Épine de hérisson", quantity: 5 },
              { id: "3", name: "Plume de griffon", quantity: 5 },
            ]}
          />
        </ReactQueryProvider>
      );

      user.click(screen.getAllByRole("checkbox")[0]);
      user.click(screen.getAllByRole("checkbox")[1]);
      user.click(screen.getAllByRole("checkbox")[2]);
      user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(
          screen.getByText("Cette potion n'existe pas encore")
        ).toBeInTheDocument();
      });
    });
  });

  describe("when submitting form and server responds with other error", () => {
    it("shows toast message with error", async () => {
      mockDiscoverRecipe.mockRejectedValue(
        new Error(RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED.message)
      );

      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <SelectIngredients
            ingredients={[
              { id: "0", name: "Argent", quantity: 5 },
              { id: "1", name: "Bave de lama", quantity: 5 },
              { id: "2", name: "Épine de hérisson", quantity: 5 },
              { id: "3", name: "Plume de griffon", quantity: 5 },
            ]}
          />
        </ReactQueryProvider>
      );

      user.click(screen.getAllByRole("checkbox")[0]);
      user.click(screen.getAllByRole("checkbox")[1]);
      user.click(screen.getAllByRole("checkbox")[2]);
      user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: "destructive",
          title: "Erreur",
          description: RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED.message,
        });
      });
    });
  });
});
