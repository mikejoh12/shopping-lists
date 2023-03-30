import * as React from "react";
import Box from "@mui/material/Box";
import { api, ShoppingListItem } from "../store/api";
import { useSelector } from "react-redux";
import NewListDialog from "../components/lists/view/NewListDialog";
import { RootState } from "../store/store";
import { useAuth } from "../hooks/useAuth";
import LoggedInManageList from "../components/lists/manage/LoggedInManageList";
import NewVisitorManageList from "../components/lists/manage/NewVisitorManageList";

export default function ManageList() {
  const { data: shoppingLists } = api.useGetAllListsQuery();
  const auth = useAuth();

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
          <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 1 }}>
            <LoggedInManageList />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ height: 400, width: "50%", margin: "auto", padding: 1 }}>
            <NewVisitorManageList />
          </Box>
        </>
      )}
    </>
  );
}
