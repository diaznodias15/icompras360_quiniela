// REACT
import { Navigate, Outlet } from "react-router";
// ROUTER
import { PublicRoutes, PrivateRoutes } from "@router/routes.router";
// STORE
import { useUserStore } from "@store/user.store";

const ProtectedRoute = ({
  redirectURL = PublicRoutes.LOGIN.route,
  allowedRoute = null,
}) => {
  const userToken = useUserStore((state) => state.token);
  const is_cli = useUserStore((state) => state.is_cli);

  if (!userToken) {
    return <Navigate replace to={redirectURL} />;
  }

  if (is_cli === null) {
    return <Navigate replace to={redirectURL} />;
  }

  if (allowedRoute && allowedRoute === PrivateRoutes.RANKING.route) {
    if (is_cli !== 0) {
      return <Navigate replace to={PrivateRoutes.PREDICTIONS.route} />;
    }
  }

  if (allowedRoute && allowedRoute === PrivateRoutes.PREDICTIONS.route) {
    if (is_cli !== 1) {
      return <Navigate replace to={PrivateRoutes.RANKING.route} />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
