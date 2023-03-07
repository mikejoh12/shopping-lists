import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ShoppingList } from "../store/api";
import { RootState } from "../store/store";

type ListsState = {
  lists: ShoppingList[];
};

const slice = createSlice({
  name: "lists",
  initialState: { lists: [] } as ListsState,
  reducers: {
    addNewVisitorList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },
    removeNewVisitorList: (state, action: PayloadAction<{ id: string }>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload.id);
    },
  },
});

export const { addNewVisitorList, removeNewVisitorList } = slice.actions;

export const selectSelectedList = (state: RootState) =>
  state.lists.lists.find(
    (list) => String(list.id) === state.user.selectedListId
  );

export const selectLists = (state: RootState) => state.lists.lists;

export default slice.reducer;
