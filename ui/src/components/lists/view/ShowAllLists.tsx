import Box from "@mui/material/Box";
import { ShoppingList } from "../../../store/api";
import { useDispatch } from "react-redux";
import { Card, CardContent, Typography } from "@mui/material";
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
          const checked = list.items.reduce(
            (acc, item) => (item.isCompleted ? acc + 1 : acc),
            0
          );
          return (
            <Card
              key={list.id}
              sx={{ minWidth: "300px", m: 1, cursor: "pointer" }}
              onClick={() => handleListClick(list.id)}
            >
              <CardContent>
                <Typography sx={{ fontWeight: "bold" }}>{list.name}</Typography>
                <Typography>
                  {checked} / {list.items.length}
                </Typography>
                {auth.user && (
                  <>
                    {list.ownerName.length > 0 &&
                      list.ownerName !== auth.user.name && (
                        <Typography>Owner: {list.ownerName}</Typography>
                      )}
                    {list.ownerName === auth.user.name &&
                      list.sharingNames.length > 0 && (
                        <Typography>
                          Shared with: {list.sharingNames}
                        </Typography>
                      )}
                    {list.sharingInviteIds?.length > 0 && (
                      <Typography>Pending share invite</Typography>
                    )}
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
