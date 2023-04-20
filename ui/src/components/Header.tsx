import Button from "@mui/material/Button";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { HeaderLoggedInIcons } from "./HeaderLoggedInIcons";

export const Header = () => {

  const selectedUser = useSelector((state: RootState) => state.user.name);

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
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              GoShopping
            </Typography>
            {selectedUser ? (
              <HeaderLoggedInIcons />
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
