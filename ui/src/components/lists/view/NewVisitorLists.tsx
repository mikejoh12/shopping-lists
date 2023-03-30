import { useDispatch, useSelector } from "react-redux";
import { selectLists } from "../../../features/listsSlice";
import ShowAllLists from "./ShowAllLists";

export default function NewVisitorLists() {
  const shoppingLists = useSelector(selectLists);
  const dispatch = useDispatch();

  return <ShowAllLists lists={shoppingLists} />;
}
