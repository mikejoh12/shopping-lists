import { useSelector } from "react-redux";
import { selectLists } from "../../../features/listsSlice";
import ShowAllLists from "./ShowAllLists";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function NewVisitorLists() {
  const shoppingLists = useSelector(selectLists);

  return (
    <>
      <Card sx={{ minWidth: 300, maxWidth: 600, m: 1 }}>
        <Paper>
          <CardContent>
            <Typography variant="h5" textAlign="center">
              The easy way to manage your shopping lists
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Start managing your shopping lists without creating an account." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Create an account for increased functionality and to synchronize your lists between different devices." />
              </ListItem>
            </List>
          </CardContent>
        </Paper>
      </Card>
      <ShowAllLists lists={shoppingLists} />
    </>
  );
}
