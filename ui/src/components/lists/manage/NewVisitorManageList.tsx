import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ShoppingListItem } from "../../../store/api";
import { useDispatch, useSelector } from "react-redux";
import AddListItemForm from "./AddListItemForm";
import { RootState } from "../../../store/store";
import ManageListDialog from "./ManageListDialog";
import { displaySnackBar, MsgSeverity } from "../../../features/uiSlice";
import { ShoppingList } from "./ShoppingList";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  addNewVisitorItem,
  removeNewVisitorItem,
  selectLists,
  selectSelectedList,
  toggleCheckboxNewVisitorItem,
} from "../../../features/listsSlice";
import { v4 as uuidv4 } from "uuid";

type Inputs = {
  newItem: string;
};

export default function NewVisitorShoppingLists() {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const shoppingLists = useSelector(selectLists);
  const selectedList = useSelector(selectSelectedList);

  let sortedList: Array<ShoppingListItem> = [];
  if (selectedList) {
    sortedList = [...selectedList.items];
    sortedList.sort(compareFn);
  }

  const dispatch = useDispatch();

  async function handleCheckBoxChange(item: ShoppingListItem) {
    dispatch(
      toggleCheckboxNewVisitorItem({
        listId: selectedListId,
        itemId: item.id,
      })
    );
  }

  const onNewItemSubmit: SubmitHandler<Inputs> = (data) => {
    reset();
    dispatch(
      addNewVisitorItem({
        listId: selectedListId,
        item: {
          id: uuidv4(),
          name: data.newItem,
          isCompleted: false,
        },
      })
    );
    dispatch(
      displaySnackBar({
        msg: "Item added: " + data.newItem,
        severity: MsgSeverity.Success,
      })
    );
  };

  async function removeItem(itemId: string) {
    dispatch(
      removeNewVisitorItem({
        listId: selectedListId,
        itemId: itemId,
      })
    );
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
        {shoppingLists.length === 0 ? (
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
            <ManageListDialog showListOwnerButtons={true} />
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
