import { styled } from "@mui/material";
import IngredientForm from "./components/IngredientForm";
import IngredientList from "./components/IngredientList";
import IngredientRecipe from "./components/IngredientRecipe";
import IngredientRecipeAction from "./components/IngredientRecipeAction";
import { useRecipeStore } from "../../hooks/useRecipeStore";

const RecipeContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

function RecipePage() {
  const { recipe } = useRecipeStore();
  const hasRecipe = Boolean(recipe);

  return (
    <RecipeContainer>
      {!hasRecipe && (
        <>
          <IngredientForm />
          <IngredientList />
          <IngredientRecipeAction />
        </>
      )}
      <IngredientRecipe />
    </RecipeContainer>
  );
}

export default RecipePage;
