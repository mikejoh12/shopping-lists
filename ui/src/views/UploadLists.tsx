import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { selectLists } from "../features/listsSlice";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UploadLists() {
  const newVisitorLists = useSelector(selectLists);
  const navigate = useNavigate();

  function handleUpload() {
    
  }

  function handleDontUpload() {
    navigate("/");
  }

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
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
        to upload these lists to your account so you can access the from any
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
              <ListItemText primary={`${idx+1}: ${list.name}`} />
            </ListItem>
          ))}
        </List>
        <Button sx={{m: 1}} variant="contained">Upload</Button>
        <Button onClick={handleDontUpload} sx={{m: 1}} variant="contained">Don't Upload</Button>
      </Box>

    </Box>
  );
}
