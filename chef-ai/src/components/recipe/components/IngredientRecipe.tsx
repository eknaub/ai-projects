import ReactMarkdown from "react-markdown";
import { useRecipeStore } from "../../../hooks/useRecipeStore";
import { Button, styled, Typography } from "@mui/material";

const RecipeContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

function IngredientRecipe() {
  const { recipe, reset } = useRecipeStore();
  const hasRecipe = Boolean(recipe);

  if (!hasRecipe) {
    return null;
  }

  return (
    <RecipeContainer>
      <Button
        variant="contained"
        style={{ backgroundColor: "#D17557" }}
        onClick={reset}
      >
        Create New Recipe
      </Button>
      <Typography variant="h5">Chef recommends:</Typography>
      <div>
        <ReactMarkdown>{recipe}</ReactMarkdown>
      </div>
    </RecipeContainer>
  );
}

export default IngredientRecipe;
