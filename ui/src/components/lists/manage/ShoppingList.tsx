import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ShoppingListItem } from "../../../store/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsManageListDialogOpen } from "../../../features/uiSlice";

interface ListProps {
  list: ShoppingListItem[];
  name: string;
  checkFn: (arg: ShoppingListItem) => void;
  removeFn: (arg: string) => void;
}

export const ShoppingList = ({ list, name, checkFn, removeFn }: ListProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleManageListClick() {
    dispatch(setIsManageListDialogOpen(true));
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        margin: "auto",
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <IconButton size="large" onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{name}</Typography>
        <IconButton size="large" onClick={handleManageListClick}>
          <MoreVertIcon />
        </IconButton>
      </Stack>

      <List>
        {list?.map((item) => (
          <ListItem disablePadding key={item.id}>
            <ListItemText primary={item.name} />

            <Checkbox
              checked={item.isCompleted}
              onChange={() => checkFn(item)}
            />

            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => removeFn(item.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
