import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Avoid redirect loops during first paint: we initialize synchronously, so
  // currentUser will be stable here. Still, guard for undefined/null.
  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
