import Box from "@mui/material/Box";
import { ShoppingList } from "../../../store/api";
import { useDispatch } from "react-redux";
import List from "@mui/material/List";
import { Button, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setSelectedList } from "../../../features/userSlice";

interface ListSelectProps {
  lists: ShoppingList[] | undefined;
}

export default function ShowAllLists({ lists }: ListSelectProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleListClick(id: string) {
    dispatch(setSelectedList({ id: id as string }));
    navigate("/manage-list");
  }

  return (
    <Box
      sx={{
        minWidth: 120,
        maxWidth: 400,
        margin: "auto",
        p: 2,
        textAlign: "center",
      }}
    >
      {lists && lists.length > 0 ? (
        <List>
          {lists?.map((list: ShoppingList, idx) => {
            return (
              <ListItem key={list.id} onClick={() => handleListClick(list.id)}>
                <Button
                  variant="contained"
                  sx={{
                    margin: "auto",
                    textTransform: "none",
                    minWidth: "250px",
                  }}
                >
                  {list.name}
                </Button>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography>No lists found</Typography>
      )}
    </Box>
  );
}
