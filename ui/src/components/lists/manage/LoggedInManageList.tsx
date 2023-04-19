import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  api,
  ShoppingListItem,
  useAddListItemMutation,
  useDeleteListItemMutation,
  useModifyListItemMutation,
} from "../../../store/api";
import { useDispatch, useSelector } from "react-redux";
import AddListItemForm from "./AddListItemForm";
import { RootState } from "../../../store/store";
import ManageListDialog from "./ManageListDialog";
import { displaySnackBar, MsgSeverity } from "../../../features/uiSlice";
import { ShoppingList } from "./ShoppingList";
import { SubmitHandler, useForm } from "react-hook-form";
import ShareListDialog from "./ShareListDialog";
import { useAuth } from "../../../hooks/useAuth";

type Inputs = {
  newItem: string;
};

export default function ShoppingLists() {
  const { data: shoppingLists, isLoading } = api.useGetAllListsQuery();
  const [addListItem] = useAddListItemMutation();
  const auth = useAuth();

  const { register, handleSubmit, reset } = useForm<Inputs>();

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

  const onNewItemSubmit: SubmitHandler<Inputs> = (data) => {
    addListItem({ name: data.newItem, listId: selectedListId });
    reset();
    dispatch(
      displaySnackBar({
        msg: "Item added: " + data.newItem,
        severity: MsgSeverity.Success,
      })
    );
  };

  async function removeItem(t: string | undefined) {
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
            variant="h5"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Please create a new list
          </Typography>
        ) : !selectedListId ? (
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            textAlign="center"
          >
            Please select a list or create a new one
          </Typography>
        ) : (
          <>
            <ManageListDialog
              showListOwnerButtons={selectedList?.ownerId === auth.user.userId}
            />
            <ShareListDialog />
            <ShoppingList
              list={sortedList}
              name={selectedList ? selectedList.name : ""}
              checkFn={handleCheckBoxChange}
              removeFn={removeItem}
            />
            <AddListItemForm
              onSubmit={onNewItemSubmit}
              handleSubmit={handleSubmit}
              register={register}
            />
          </>
        )}
      </Box>
    </>
  );
}
