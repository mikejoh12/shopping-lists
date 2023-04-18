import * as React from "react";
import Box from "@mui/material/Box";
import { api, ShoppingListItem } from "../store/api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAuth } from "../hooks/useAuth";
import LoggedInManageList from "../components/lists/manage/LoggedInManageList";
import NewVisitorManageList from "../components/lists/manage/NewVisitorManageList";

export default function ManageList() {
  const auth = useAuth();

  return (
    <>
      {auth.user ? (
        <>
          <Box sx={{ height: 400, margin: "auto", padding: 1 }}>
            <LoggedInManageList />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ height: 400, margin: "auto", padding: 1 }}>
            <NewVisitorManageList />
          </Box>
        </>
      )}
    </>
  );
}
