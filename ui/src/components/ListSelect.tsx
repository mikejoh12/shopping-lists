import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function ListSelect() {
  const [list, setList] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setList(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120, maxWidth: 400, margin: "auto", p: 2}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">List</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={list}
          label="List"
          onChange={handleChange}
        >
          <MenuItem value="Groceries">Groceries</MenuItem>
          <MenuItem value="Target">Target</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}