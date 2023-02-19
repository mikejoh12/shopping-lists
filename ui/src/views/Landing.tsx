import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function Landing() {


  return (
    <Box>
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
        sx={{p: 2}}
      >
        Go Todo List
      </Typography>
      
    </Box>
  );
}
