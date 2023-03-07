import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ShoppingListItem } from "../store/api";

interface ListProps {
  list: ShoppingListItem[];
  checkFn: (arg: ShoppingListItem) => void;
  removeFn: (arg: number | undefined) => void;
}

export const ShoppingList = ({ list, checkFn, removeFn }: ListProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        margin: "auto",
        bgcolor: "background.paper",
      }}
    >
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
