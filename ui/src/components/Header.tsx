import Button from "@mui/material/Button";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { api, useLogoutUserMutation } from "../store/api";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setSelectedList } from "../features/userSlice";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedUser = useSelector((state: RootState) => state.user.name);

  function handleLogout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    logoutUser();
    dispatch(setCredentials(null));
    dispatch(setSelectedList({ id: "" }));
    dispatch(api.util.resetApiState());
    navigate("/");
    dispatch(
      displaySnackBar({
        msg: "Logout Successful",
        severity: MsgSeverity.Success,
      })
    );
  }

  const [logoutUser] = useLogoutUserMutation();

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                boxShadow: "none",
                color: "black",
              }}
            >
              Shopping Lists
            </Typography>
            {selectedUser ? (
              <>
                <Button component={Link} color="inherit" to="/account">
                  Account
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
    </>
  );
};
