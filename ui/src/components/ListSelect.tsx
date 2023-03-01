import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { api } from "../store/api";
import { ShoppingList } from "../store/api";
import { setSelectedListId } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

export default function ListSelect() {
  const [list, setList] = React.useState("");
  const dispatch = useDispatch();

  const { data: shoppingLists } = api.useGetAllListsQuery();

  const handleChange = (event: SelectChangeEvent) => {
    setList(event.target.value as string);
    dispatch(setSelectedListId(event.target.value as string));
  };

  return (
    <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">List</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={list}
          label="List"
          onChange={handleChange}
        >
          {shoppingLists?.map((list: ShoppingList, idx) => {
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
