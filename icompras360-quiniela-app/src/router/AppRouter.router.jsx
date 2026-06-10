// REACT
import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
// LAYOUT
import Layout from "@layouts/Layout";
// COMPONENTS
import { Loader } from "@components/common/Loader/Loader.component";
import { ModalLogout } from "@components/common/ModalLogout/ModalLogout.component";
// CONTEXT
import { AppContext } from "@context/app.context";
// ROUTER
import { PrivateRoutes, PublicRoutes } from "./routes.router";
import ProtectedRoute from "./ProtectedRoutes.router";

const Login = lazy(() => import("@pages/Login.page"));
const Predictions = lazy(() => import("@pages/Predictions.page"));
const SignUp = lazy(() => import("@pages/SignUp.page"));

const AppRouter = () => {
  // CONTEXT
  const { isModalLogoutOpened, modalLogoutActions } = useContext(AppContext);

  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route
            path={PublicRoutes.LOGIN.route}
            element={
              <Suspense fallback={<Loader />}>
                <Login />
              </Suspense>
            }
          />

          {/* SIGNUP */}
          <Route
            path={PublicRoutes.SIGNUP.route}
            element={
              <Suspense fallback={<Loader />}>
                <SignUp />
              </Suspense>
            }
          />

          {/* PROTECTED ROUTE */}
          <Route
            element={<ProtectedRoute redirectURL={PublicRoutes.LOGIN.route} />}
          >
            {/* QUINIELA */}
            <Route
              element={
                <Layout
                  pageName="PREDICCIONES"
                  id={PrivateRoutes.PREDICTIONS.id}
                />
              }
            >
              <Route
                path={`${PrivateRoutes.PREDICTIONS.route}`}
                element={<Predictions />}
              />
            </Route>
          </Route>

          {/* REDIRECT */}
          <Route
            path="*"
            element={<Navigate to={PublicRoutes.LOGIN.route} />}
          />
        </Routes>
        <ModalLogout
          isModalOpened={isModalLogoutOpened}
          modalActions={modalLogoutActions}
        />
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
