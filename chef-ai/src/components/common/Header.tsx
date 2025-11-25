import { styled, Typography } from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";

const HeaderContainer = styled("header")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  boxShadow:
    "0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
  padding: "16px",
  height: "64px",
  backgroundColor: "#ffffff",
});

export default function Header() {
  return (
    <HeaderContainer>
      <CookieIcon fontSize="large" />
      <Typography variant="h5">Chef AI</Typography>
    </HeaderContainer>
  );
}
