// REACT
import { Navigate, Outlet } from "react-router";
// ROUTER
import { PublicRoutes, PrivateRoutes } from "@router/routes.router";
// STORE
import { useUserStore } from "@store/user.store";

const ProtectedRoute = ({
  redirectURL = PublicRoutes.LOGIN.route,
  allowedRoutes = null,
}) => {
  const userToken = useUserStore((state) => state.token);
  const is_cli = useUserStore((state) => state.is_cli);
  const logout = useUserStore((state) => state.reset);

  if (!userToken) {
    logout();
    return <Navigate replace to={redirectURL} />;
  }

  if (is_cli === null) {
    logout();
    return <Navigate replace to={redirectURL} />;
  }

  if (allowedRoutes && Array.isArray(allowedRoutes)) {
    const isAdminRoute = allowedRoutes.some(
      (route) =>
        route === PrivateRoutes.RANKING.route ||
        route === PrivateRoutes.ADMIN_PARTIDOS.route
    );
    if (isAdminRoute && is_cli !== 0) {
      return <Navigate replace to={PrivateRoutes.PREDICTIONS.route} />;
    }

    const isClientRoute = allowedRoutes.some(
      (route) => route === PrivateRoutes.PREDICTIONS.route
    );
    if (isClientRoute && is_cli !== 1) {
      return <Navigate replace to={PrivateRoutes.RANKING.route} />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
