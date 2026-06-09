// REACT
import { Navigate, Outlet } from "react-router";
// ROUTER
import { PublicRoutes } from "@router/routes.router";
// STORE
import { useUserStore } from "@store/user.store";

const ProtectedRoute = ({ redirectURL = PublicRoutes.LOGIN.route }) => {
  const userToken = useUserStore((state) => state.token);

  if (!userToken) {
    return <Navigate replace to={redirectURL} />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
