import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ShoppingList, ShoppingListItem } from "../store/api";
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
    addNewVisitorItem: (state, action: PayloadAction<{ listId: string,item: ShoppingListItem }>) => {
      let idx = state.lists.findIndex((list) => list.id === action.payload.listId);
      state.lists[idx].items.push(action.payload.item)
    },
    toggleCheckboxNewVisitorItem: (state, action: PayloadAction<{ listId: string, itemId: string }>) => {
      let listIdx = state.lists.findIndex((list) => list.id === action.payload.listId);
      let itemIdx = state.lists[listIdx].items.findIndex((item) => item.id === action.payload.itemId);
      state.lists[listIdx].items[itemIdx].isCompleted = !state.lists[listIdx].items[itemIdx].isCompleted
    },
    removeNewVisitorItem: (state, action: PayloadAction<{ listId: string, itemId: string }>) => {
      let listIdx = state.lists.findIndex((list) => list.id === action.payload.listId);
      state.lists[listIdx].items = state.lists[listIdx].items.filter((item) => item.id !== action.payload.itemId)
    },
    removeCheckedItems: (state, action: PayloadAction<{listId: string}>) => {
      let listIdx = state.lists.findIndex((list) => list.id === action.payload.listId);
      state.lists[listIdx].items = state.lists[listIdx].items.filter((item) => !item.isCompleted)

    },
    clearLists: (state, action: PayloadAction<void>) => {
      state.lists = []
    }
  },
});

export const { addNewVisitorList, removeNewVisitorList, addNewVisitorItem, toggleCheckboxNewVisitorItem, removeNewVisitorItem, removeCheckedItems, clearLists } = slice.actions;

export const selectSelectedList = (state: RootState) =>
  state.lists.lists.find(
    (list) => String(list.id) === state.user.selectedListId
  );

export const selectLists = (state: RootState) => state.lists.lists;

export default slice.reducer;
