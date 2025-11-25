import { create } from "zustand";
import { genAi } from "../utils/services/aiService";

interface RecipeState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  generateRecipe: () => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  ingredients: [],
  addIngredient: (ingredient: string) =>
    set((state) => ({ ingredients: [...state.ingredients, ingredient] })),
  generateRecipe: async () => {
    try {
      const ingredients = get().ingredients;
      const response = await genAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `This is the list of ingredients the user has: ${ingredients.join(
          ", "
        )}. Suggest a recipe they could make with some or all of those ingredients. Format your response in markdown.`,
        config: {
          systemInstruction: `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page`,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  },
}));
