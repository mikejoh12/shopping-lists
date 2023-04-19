import Button from "@mui/material/Button";
import { IconButton, Badge } from "@mui/material";
import { api, useLogoutUserMutation } from "../store/api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, setSelectedList } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";
import { AccountCircle } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";

export const HeaderLoggedInIcons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    logoutUser();
    dispatch(setCredentials({ username: null, userId: null }));
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
  const { data: inviteLists } = api.useGetAllShareInviteListsQuery();

  return (
    <>
      <IconButton size="large" color="inherit" component={Link} to="/mail">
        <Badge badgeContent={inviteLists?.length} color="info">
          <EmailIcon />
        </Badge>
      </IconButton>
      <IconButton size="large" color="inherit" component={Link} to="/account">
        <AccountCircle />
      </IconButton>
      <Button color="inherit" onClick={(e) => handleLogout(e)}>
        Log out
      </Button>
    </>
  );
};
