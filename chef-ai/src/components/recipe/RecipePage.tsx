import IngredientForm from "./components/IngredientForm";
import IngredientList from "./components/IngredientList";
import IngredientRecipeAction from "./components/IngredientRecipeAction";

function RecipePage() {
  return (
    <>
      <IngredientForm />
      <IngredientList />
      <IngredientRecipeAction />
    </>
  );
}

export default RecipePage;
