import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const HeaderLayout = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Go Todo List
            </Typography>
            <Button color="inherit" href="/">
              Todos
            </Button>
            <Button color="inherit" href="/login">
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
