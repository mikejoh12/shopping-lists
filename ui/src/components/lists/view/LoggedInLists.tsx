import { useDispatch } from "react-redux";
import { api } from "../../../store/api";
import ShowAllLists from "./ShowAllLists";

export default function NewVisitorLists() {
  const { data: shoppingLists, isLoading } = api.useGetAllListsQuery();
  const dispatch = useDispatch();

  return <ShowAllLists lists={shoppingLists} />;
}
