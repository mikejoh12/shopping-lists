import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ShoppingList } from "../../store/api";
import { setSelectedList } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ListSelectProps {
  list: ShoppingList[] | undefined;
}

export default function ListSelect({ list }: ListSelectProps) {
  const dispatch = useDispatch();
  const listId = useSelector((state: RootState) => state.user.selectedListId);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedList({ id: event.target.value as string }));
  };

  return (
    <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="select-list-label">List</InputLabel>
        <Select
          labelId="select-list-label"
          id="select-list"
          value={list?.some((item) => item.id === listId) ? listId : ""}
          label="List"
          onChange={handleChange}
        >
          {list?.map((list: ShoppingList, idx) => {
            return (
              <MenuItem key={idx} value={list.id}>
                {list.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
