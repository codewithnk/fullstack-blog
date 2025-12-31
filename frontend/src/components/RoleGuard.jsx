import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
