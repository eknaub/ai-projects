import { create } from "zustand";

interface RecipeState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  ingredients: [],
  addIngredient: (ingredient: string) =>
    set((state) => ({ ingredients: [...state.ingredients, ingredient] })),
}));
