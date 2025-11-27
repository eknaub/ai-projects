import { Button, styled, Typography } from "@mui/material";
import { useRecipeStore } from "../../../hooks/useRecipeStore";

const IntegrientRecipeContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 8,
  background: "#F0EFEB",
  padding: "10px 28px",
});

const IntegrientTextContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

function IngredientRecipeAction() {
  const { ingredients, generateRecipe, isGeneratingRecipe } = useRecipeStore();
  const isMinIngredients = ingredients.length > 3;

  if (!isMinIngredients) {
    return null;
  }

  return (
    <IntegrientRecipeContainer>
      <IntegrientTextContainer>
        <Typography variant="h6">Ready for a Recipe?</Typography>
        <Typography variant="body2">
          Generate a recipe based on your ingredients!
        </Typography>
      </IntegrientTextContainer>
      <Button
        variant="contained"
        style={{ backgroundColor: "#D17557" }}
        onClick={generateRecipe}
        loading={isGeneratingRecipe ? true : false}
      >
        Generate Recipe
      </Button>
    </IntegrientRecipeContainer>
  );
}

export default IngredientRecipeAction;
