import { Typography } from "@mui/material";
import { useRecipeStore } from "../../../hooks/useRecipeStore";

function IngredientList() {
  const { ingredients } = useRecipeStore();
  const hasIngredients = ingredients.length > 0;

  if (!hasIngredients) {
    return null;
  }

  return (
    <div>
      <Typography
        variant="caption"
        style={{
          fontStyle: "italic",
        }}
      >
        INFO: Add at least 4 ingredients to generate a recipe.
      </Typography>
      <Typography variant="h5">Your Ingredients:</Typography>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientList;
