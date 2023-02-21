import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { useLogoutUserMutation } from "../store/todosApi";

export const HeaderLayout = () => {
  function handleLogout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    console.log("Logging out");
    logoutUser();
  }

  const [logoutUser] = useLogoutUserMutation();

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
              <Button color="inherit" onClick={(e) => handleLogout(e)}>
                Log out
              </Button>
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
