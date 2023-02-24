import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { api, useDeleteListItemMutation } from "../store/api";
import AddListItemForm from "./AddListItemForm";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ListSelect from "../components/ListSelect";
import NewListDialog from "../components/NewListDialog";

export default function Todos() {
  const { data: todos, isLoading } = api.useGetAllListItemsQuery();

  const [
    deleteTodo, // This is the mutation trigger
    { isLoading: isDeleteUpdating }, // This is the destructured mutation result
  ] = useDeleteListItemMutation();

  function removeTodo(t: number | undefined) {
    console.log("Removing todo:", t);
    deleteTodo(t);
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
                {todos?.items?.map((todo) => (
                  <ListItem disablePadding key={todo.id}>
                    <ListItemText primary={todo.name} />

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeTodo(todo.id)}
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
