import ResizeObserver from "resize-observer-polyfill";

import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RECIPE_EXCEPTIONS,
  RECIPE_EXCEPTIONS_USER_FACING,
} from "@/domain/Recipe/recipe-exceptions";
import { SelectIngredients } from "@/components/main/SelectIngredients/SelectIngredients";

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
  describe("when an ingredient has quantity 0", () => {
    it("displays disabled checkbox", async () => {
      const user = userEvent.setup();
      render(
        <ReactQueryProvider>
          <SelectIngredients
            ingredients={[{ id: "0", name: "Argent", quantity: 0 }]}
          />
        </ReactQueryProvider>
      );

      await user.click(screen.getAllByRole("checkbox")[0]);
      expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    });
  });

  describe("when less than three ingredients are selected", () => {
    it("displays disabled Submit button with selected count", async () => {
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

      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getAllByRole("checkbox")[1]);

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeDisabled();
      });
    });
  });

  describe("when three ingredients are selected", () => {
    it("displays enabled Submit button", async () => {
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

      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getAllByRole("checkbox")[1]);
      await user.click(screen.getAllByRole("checkbox")[2]);

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeEnabled();
      });
    });
  });

  describe("when three ingredients are selected, selecting a fourth ingredient", () => {
    it("does not select fourth ingredient, shows toast message with error", async () => {
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

      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getAllByRole("checkbox")[1]);
      await user.click(screen.getAllByRole("checkbox")[2]);
      await user.click(screen.getAllByRole("checkbox")[3]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: "destructive",
          title: "Erreur",
          description:
            RECIPE_EXCEPTIONS_USER_FACING[
              RECIPE_EXCEPTIONS.RECIPE_MUST_HAVE_THREE_INGREDIENTS
            ],
        });
      });
      await waitFor(() => {
        expect(screen.getAllByRole("checkbox")[3]).not.toBeChecked();
      });
    });
  });

  describe("when three ingredients are selected, selecting a fourth ingredient then unselecting another one", () => {
    it("unselects ingredient", async () => {
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

      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getAllByRole("checkbox")[1]);
      await user.click(screen.getAllByRole("checkbox")[2]);
      await user.click(screen.getAllByRole("checkbox")[3]);

      await user.click(screen.getAllByRole("checkbox")[2]);
      await waitFor(() => {
        expect(screen.getAllByRole("checkbox")[2]).not.toBeChecked();
      });
    });
  });

  describe("when submitting form and server responds with success", () => {
    it("refreshes data, shows toast message with discovered recipe, resets form", async () => {
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

      await user.click(screen.getAllByRole("checkbox")[0]);
      await user.click(screen.getAllByRole("checkbox")[1]);
      await user.click(screen.getAllByRole("checkbox")[2]);
      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockDiscoverRecipe).toHaveBeenCalledWith(["0", "1", "2"]);
      });
      await waitFor(() => {
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Bravo !",
          description: "Vous avez découvert la Potion existante",
        });
      });

      await waitFor(() => {
        expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
      });
    });
  });

  describe("when submitting form and server responds with exception RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED", () => {
    it("shows dialog to ask user if they want to create new recipe", async () => {
      mockDiscoverRecipe.mockRejectedValue(
        new Error(RECIPE_EXCEPTIONS.RECIPE_MUST_BE_CREATED_BEFORE_DISCOVERED)
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
        new Error(RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED)
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
          description:
            RECIPE_EXCEPTIONS_USER_FACING[
              RECIPE_EXCEPTIONS.RECIPE_ALREADY_DISCOVERED
            ],
        });
      });
    });
  });
});
