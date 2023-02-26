import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store/store";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const selectedUser = useSelector((state: RootState) => state.user.name);
  let location = useLocation();

  if (!selectedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
