import Box from "@mui/material/Box";
import { ShoppingList } from "../../../store/api";
import { useDispatch } from "react-redux";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setSelectedList } from "../../../features/userSlice";
import { useAuth } from "../../../hooks/useAuth";

interface ListSelectProps {
  lists: ShoppingList[] | undefined;
}

export default function ShowAllLists({ lists }: ListSelectProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  function handleListClick(id: string) {
    dispatch(setSelectedList({ id: id as string }));
    navigate("/manage-list");
  }

  return (
    <Box
      sx={{
        minWidth: 120,
        maxWidth: 400,
        margin: "auto",
        p: 2,
        textAlign: "center",
      }}
    >
      {lists && lists.length > 0 ? (
        lists?.map((list: ShoppingList, idx) => {
          return (
            <Card
              key={list.id}
              sx={{ minWidth: "300px", m: 1, cursor: "pointer" }}
              onClick={() => handleListClick(list.id)}
            >
              <CardContent>
                <Typography>{list.name}</Typography>
                <Typography>Items: {list.items.length}</Typography>
                {auth.user && (
                  <>
                    <Typography>Owner: {list.ownerName}</Typography>
                    <Typography>Shared with: {list.sharingNames}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography>No lists found</Typography>
      )}
    </Box>
  );
}
