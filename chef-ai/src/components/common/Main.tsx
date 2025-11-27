import { styled } from "@mui/material";
import RecipePage from "../recipe/RecipePage";

const MainContainer = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

function Main() {
  return (
    <MainContainer>
      <RecipePage />
    </MainContainer>
  );
}

export default Main;
