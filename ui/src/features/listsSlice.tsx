import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ShoppingList } from "../store/api";

type ListsState = {
  lists: ShoppingList[];
};

const slice = createSlice({
  name: "lists",
  initialState: { lists: [] } as ListsState,
  reducers: {
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload)
    },
    removeList: (state, action: PayloadAction<{id: number}>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload.id)
    },
  },
});

export const { addList, removeList } = slice.actions;

export default slice.reducer;