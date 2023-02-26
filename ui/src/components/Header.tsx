import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { useLogoutUserMutation } from "../store/api";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/user/userSlice";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

export const HeaderLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedUser = useSelector((state: RootState) => state.user.name);

  function handleLogout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    console.log("Logging out");
    logoutUser();
    dispatch(setCredentials(null));
    navigate("/");
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
            {selectedUser ? (
              <>
                <Button component={Link} color="inherit" to="/lists">
                  Lists
                </Button>
                <Button color="inherit" onClick={(e) => handleLogout(e)}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} color="inherit" to="/register">
                  Register
                </Button>
                <Button component={Link} color="inherit" to="/login">
                  Login
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
