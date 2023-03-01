import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { api, useDeleteListItemMutation } from "../store/api";
import { useSelector } from "react-redux";
import AddListItemForm from "./AddListItemForm";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ListSelect from "../components/ListSelect";
import NewListDialog from "../components/NewListDialog";
import { RootState } from "../store/store";

export default function ListItems() {
  const { data: shoppingLists, isLoading } = api.useGetAllListsQuery();
  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const [deleteItem] = useDeleteListItemMutation();

  function removeItem(t: number | undefined) {
    deleteItem(t);
  }

  return (
    <>
      <ListSelect />
      <NewListDialog />
      <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 4 }}>
        {isLoading ? (
          <Typography variant="h3" component="div" gutterBottom>
            Loading
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                margin: "auto",
                bgcolor: "background.paper",
              }}
            >
              <List>
                {shoppingLists
                  ?.find((list) => {
                    return String(list.id) === selectedListId;
                  })
                  ?.items?.map((list) => (
                    <ListItem disablePadding key={list.id}>
                      <ListItemText primary={list.name} />

                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeItem(list.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
              </List>
            </Box>
            <AddListItemForm />
          </>
        )}
      </Box>
    </>
  );
}
