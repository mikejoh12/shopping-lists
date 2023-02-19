import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

export const HeaderLayout = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Go Todo List
            </Typography>
            <Button color="inherit" href="/todos">
              Todos
            </Button>
            <Button color="inherit" href="/login">
              Login
            </Button>
            <Button color="inherit" href="/register">
              Register
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
