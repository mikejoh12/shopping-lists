import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ShoppingLists from "./LoggedInShoppingLists";

export default function Landing() {
  return (
    <Box>
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        textAlign={"center"}
        sx={{ p: 2 }}
      >
        Shopping Lists
      </Typography>

      <ShoppingLists />
    </Box>
  );
}
