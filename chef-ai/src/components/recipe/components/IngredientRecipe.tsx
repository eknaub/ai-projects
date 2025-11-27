import ReactMarkdown from "react-markdown";
import { useRecipeStore } from "../../../hooks/useRecipeStore";
import { Button } from "@mui/material";

function IngredientRecipe() {
  const { recipe, reset } = useRecipeStore();
  const hasRecipe = Boolean(recipe);

  if (!hasRecipe) {
    return null;
  }

  return (
    <div>
      <Button
        variant="contained"
        style={{ backgroundColor: "#D17557" }}
        onClick={reset}
      >
        Create New Recipe
      </Button>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </div>
  );
}

export default IngredientRecipe;
