import * as React from "react";
import Box from "@mui/material/Box";
import {
  api,
  ShoppingListItem,
} from "../store/api";
import { useSelector } from "react-redux";
import ListSelect from "../components/lists/ListSelect";
import NewListDialog from "../components/lists/NewListDialog";
import { RootState } from "../store/store";
import { useAuth } from "../hooks/useAuth";
import LoggedInShoppingLists from "../components/lists/LoggedInShoppingLists";
import NewVisitorShoppingLists from "../components/lists/NewVisitorShoppingLists";
import { selectLists } from "../features/listsSlice";

export default function ShoppingLists() {
  const { data: shoppingLists } = api.useGetAllListsQuery();
  const auth = useAuth();

  const selectedListId = useSelector(
    (state: RootState) => state.user.selectedListId
  );

  const newVisitorLists = useSelector(selectLists)

  const selectedList = shoppingLists?.find((list) => {
    return String(list.id) === selectedListId;
  });

  let sortedList: Array<ShoppingListItem> = [];
  if (selectedList) {
    sortedList = [...selectedList.items];
    sortedList.sort(compareFn);
  }


  function compareFn(a: ShoppingListItem, b: ShoppingListItem) {
    if (a.isCompleted && !b.isCompleted) {
      return 1;
    }
    return -1;
  }

  return (
    <>
      {auth.user ? (
        <>
          <ListSelect list={shoppingLists} />
          <NewListDialog />
          <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 1 }}>
            <LoggedInShoppingLists />
          </Box>
        </>
      ) : (
        <>
          <ListSelect list={newVisitorLists} />
          <NewListDialog />
          <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 1 }}>
            <NewVisitorShoppingLists />
          </Box>
        </>
      )}
    </>
  );
}
