import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  ShoppingListItem,
} from "../../store/api";
import { useDispatch, useSelector } from "react-redux";
import AddListItemForm from "./AddListItemForm";
import { RootState } from "../../store/store";
import ManageListDialog from "./ManageListDialog";
import { displaySnackBar, MsgSeverity } from "../../features/uiSlice";
import { ShoppingList } from "./ShoppingList";
import { SubmitHandler, useForm } from "react-hook-form";
import { selectLists, selectSelectedList } from "../../features/listsSlice";

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
    console.log("Changing checkbox");
  }

  const onNewItemSubmit: SubmitHandler<Inputs> = (data) => {
    reset();
    dispatch(
      displaySnackBar({
        msg: "Item added: " + data.newItem,
        severity: MsgSeverity.Success,
      })
    );
  };

  async function removeItem(t: number | undefined) {
    dispatch(
      displaySnackBar({
        msg: "The was a problem with the server",
        severity: MsgSeverity.Error,
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
            <ShoppingList
              list={sortedList}
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
