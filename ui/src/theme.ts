import { createTheme } from "@mui/material/styles";

/*
declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
*/
export const theme = createTheme({
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
