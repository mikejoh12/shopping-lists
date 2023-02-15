import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { api, useDeleteTodoMutation } from "../store/todos";
import AddTodoForm from "./AddTodoForm";
import { ListItemButton } from "@mui/material";

export default function Todos() {
  const { data: todos, isLoading } = api.useGetAllTodosQuery();
  console.log(todos);

  const [
    deleteTodo, // This is the mutation trigger
    { isLoading: isDeleteUpdating }, // This is the destructured mutation result
  ] = useDeleteTodoMutation();

  function removeTodo(t: number | undefined) {
    console.log("Removing todo:", t);
    deleteTodo(t);
  }

  return (
    <>
      <Typography
        variant="h1"
        component="div"
        gutterBottom
        textAlign={"center"}
      >
        Go Todo List
      </Typography>
      <Box sx={{ height: 400, width: "50%", margin: "auto" }}>
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
                {todos?.map((todo) => (
                  <ListItem disablePadding key={todo.id}>
                    <ListItemText primary={todo.name} />
                    <ListItemButton onClick={() => removeTodo(todo.id)}>
                      Remove
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <AddTodoForm />
          </>
        )}
      </Box>
    </>
  );
}