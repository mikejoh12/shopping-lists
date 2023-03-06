import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  api,
  ShoppingListItem,
  useDeleteListItemMutation,
  useModifyListItemMutation,
} from "../store/api";
import { useDispatch, useSelector } from "react-redux";
import AddListItemForm from "../components/AddListItemForm";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ListSelect from "../components/ListSelect";
import NewListDialog from "../components/NewListDialog";
import { RootState } from "../store/store";
import ManageListDialog from "../components/ManageListDialog";
import { displaySnackBar, MsgSeverity } from "../features/uiSlice";
import Checkbox from "@mui/material/Checkbox";

export default function ListItems() {
  const { data: shoppingLists, isLoading } = api.useGetAllListsQuery();
  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const selectedList = shoppingLists?.find((list) => {
    return String(list.id) === selectedListId;
  });

  let sortedList: Array<ShoppingListItem> = [];
  if (selectedList) {
    sortedList = [...selectedList.items];
    sortedList.sort(compareFn);
  }

  const dispatch = useDispatch();
  const [deleteItem] = useDeleteListItemMutation();
  const [modifyListItem] = useModifyListItemMutation();

  async function handleCheckBoxChange(item: ShoppingListItem) {
    let newItem = { ...item, isCompleted: !item.isCompleted };
    try {
      await modifyListItem(newItem).unwrap();
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "The was a problem with the server",
          severity: MsgSeverity.Error,
        })
      );
    }
  }

  async function removeItem(t: number | undefined) {
    try {
      await deleteItem(t).unwrap();
      dispatch(
        displaySnackBar({ msg: "Item deleted", severity: MsgSeverity.Success })
      );
    } catch (err) {
      dispatch(
        displaySnackBar({
          msg: "The was a problem with the server",
          severity: MsgSeverity.Error,
        })
      );
    }
  }

  function compareFn(a: ShoppingListItem, b: ShoppingListItem) {
    if (a.isCompleted && !b.isCompleted) {
      return 1;
    }
    return -1;
  }

  return (
    <>
      <ListSelect />
      <NewListDialog />
      <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 1 }}>
        {isLoading ? (
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Loading
          </Typography>
        ) : shoppingLists == null ? (
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Please create a new list
          </Typography>
        ) : !selectedListId ? (
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Please select a list or create a new one
          </Typography>
        ) : (
          <>
            <ManageListDialog />
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                margin: "auto",
                bgcolor: "background.paper",
              }}
            >
              <List>
                {sortedList?.map((item) => (
                  <ListItem disablePadding key={item.id}>
                    <ListItemText primary={item.name} />

                    <Checkbox
                      checked={item.isCompleted}
                      onChange={() => handleCheckBoxChange(item)}
                    />

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeItem(item.id)}
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
