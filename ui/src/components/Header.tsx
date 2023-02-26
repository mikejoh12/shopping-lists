import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { useLogoutUserMutation } from "../store/api";
import { Link } from "react-router-dom";

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
              Shopping Lists
            </Typography>
            <Button component={Link} color="inherit" to="/lists">
              Lists
            </Button>
            <Button component={Link} color="inherit" to="/login">
              Login
            </Button>
            <Button component={Link} color="inherit" to="/register">
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
