import { Button, styled, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRecipeStore } from "../../../hooks/useRecipeStore";

const Form = styled("form")({
  display: "flex",
  gap: "16px",
  justifyContent: "center",
});

const IngredientButton = styled(Button)({
  backgroundColor: "black",
});

function IngredientForm() {
  const { addIngredient } = useRecipeStore();

  const handleAddIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;

    addIngredient(data.ingredient);
    event.currentTarget.reset();
  };

  return (
    <Form onSubmit={handleAddIngredient}>
      <TextField name="ingredient" label="Ingredient" />
      <IngredientButton
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add Ingredient
      </IngredientButton>
    </Form>
  );
}

export default IngredientForm;
