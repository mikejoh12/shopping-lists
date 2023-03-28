import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { clearLists, selectLists } from "../features/listsSlice";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddListsMutation } from "../store/api";
import { useDispatch } from "react-redux";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";

export default function UploadLists() {
  const newVisitorLists = useSelector(selectLists);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addLists] = useAddListsMutation();

  async function handleUpload() {
    try {
      await addLists(newVisitorLists).unwrap();
      dispatch(clearLists());
      dispatch(
        displaySnackBar({
          msg: "Lists uploaded",
          severity: MsgSeverity.Success,
        })
      );
      navigate("/");
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "Error uploading lists",
          severity: MsgSeverity.Error,
        })
      );
    }
  }

  function handleDontUpload() {
    navigate("/");
  }

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        Upload Lists
      </Typography>
      <Typography
        variant="body1"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        You have worked on the following lists before signing in. Would you like
        to upload these lists to your account so you can access them from any
        device where you sign in?
      </Typography>

      <Box
        sx={{
          width: "100%",
          margin: "auto",
          textAlign: "center",
          maxWidth: 200,
        }}
      >
        <List>
          {newVisitorLists?.map((list, idx) => (
            <ListItem key={list.id}>
              <ListItemText primary={`${idx + 1}: ${list.name}`} />
            </ListItem>
          ))}
        </List>
        <Button onClick={handleUpload} sx={{ m: 1 }} variant="contained">
          Upload
        </Button>
        <Button onClick={handleDontUpload} sx={{ m: 1 }} variant="contained">
          Don't Upload
        </Button>
      </Box>
    </Box>
  );
}
