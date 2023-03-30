import Box from "@mui/material/Box";
import { ShoppingList } from "../../../store/api";
import { useDispatch } from "react-redux";
import List from "@mui/material/List";
import { Button, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setSelectedList } from "../../../features/userSlice";

interface ListSelectProps {
  lists: ShoppingList[] | undefined;
}

export default function ShowAllLists({ lists }: ListSelectProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleListClick(id: string) {
    console.log(id);
    dispatch(setSelectedList({ id: id as string }));
    navigate("/manage-list");
  }

  return (
    <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2 }}>
      <List>
        {lists?.map((list: ShoppingList, idx) => {
          return (
            <ListItem
              disablePadding
              key={list.id}
              onClick={() => handleListClick(list.id)}
            >
              <Button>{list.name}</Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
