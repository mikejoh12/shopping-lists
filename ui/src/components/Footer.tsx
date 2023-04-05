import {
  Box,
  Divider,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export const Footer = () => {
  return (
    <>
      <Box>
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
              color: "black",
            }}
          >
            Shopping Lists
          </Typography>
          <IconButton>
            <GitHubIcon
              onClick={() => window.open("https://github.com/mikejoh12/go-todo", "_blank")}
            />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
};
