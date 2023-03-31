import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff7043",
    },
    secondary: {
      main: "#6b59c9",
    },
  },
});

theme = responsiveFontSizes(theme);

export { theme };
