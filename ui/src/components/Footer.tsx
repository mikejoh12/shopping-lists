import { Box, Divider, Typography, IconButton, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export const Footer = () => {
  return (
    <>
      <Box sx={{ backgroundColor: "black", p: 2 }}>
        <Divider variant="middle" />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
          sx={{ p: 2 }}
        >
          <Typography
            variant="h5"
            sx={{
              textDecoration: "none",
              boxShadow: "none",
              color: "white",
            }}
          >
            GoShopping
          </Typography>
          <IconButton
            color="primary"
            onClick={() =>
              window.open("https://github.com/mikejoh12/go-todo", "_blank")
            }
          >
            <GitHubIcon />
          </IconButton>
        </Stack>
        <Typography
            variant="body1"
            sx={{
              textDecoration: "none",
              boxShadow: "none",
              color: "white",
              textAlign: "center"
            }}
          >
            A project built in Go, TypeScript (React), and MongoDB
          </Typography>
      </Box>
    </>
  );
};
