// MANTINE
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { loginAdapter } from "@adapters/auth/login.adapter";
// ROUTER
import { PrivateRoutes } from "@router/routes.router";

export const handleLogIn = async (data, controller, states, storeData) => {
  try {
    const { isLoadingActions, isModalEmailUnverifiedActions, navigate } =
      states;
    isLoadingActions.open();
    await axiosRequest({
      url: `/api/auth/login`,
      method: "POST",
      data: {
        email: data.email,
        password: data.password,
      },
      controller: controller,
      onSuccess: async (response) => {
        const loginAdapted = loginAdapter(response);
        storeData.setUserID(loginAdapted.id);
        storeData.setUserEmail(loginAdapted.email);
        storeData.setUserToken(loginAdapted.token);
        storeData.setUserIsCli(loginAdapted.is_cli);
        isLoadingActions.close();

        const redirectRoute =
          loginAdapted.is_cli === 1
            ? PrivateRoutes.PREDICTIONS.route
            : PrivateRoutes.RANKING.route;

        navigate(`${redirectRoute}`, { replace: true });
        notifications.show({
          color: "success",
          message: <Text>Bienvenido(a)</Text>,
        });
      },
      onError: (code, error) => {
        console.error("Error al iniciar sesión: ", code, " | ", error.message);
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        isLoadingActions.close();
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
  }
};

export const logOut = async (states, storeData) => {
  try {
    const { token, logout } = storeData;
    const { setIsLoading, modalActions } = states;
    setIsLoading(true);
    await axiosRequest({
      url: `/api/auth/logout`,
      method: "POST",
      authToken: token,
      onSuccess: async (response) => {
        modalActions.close();
        logout();
        setIsLoading(false);
      },
      onError: (code, error) => {
        console.error("Error al cerrar sesión: ", code, " | ", error.message);
        modalActions.close();
        logout();
        setIsLoading(false);
      },
    });
    notifications.show({
      color: "success",
      title: "OK",
      message: "Has cerrado sesión correctamente, esperamos verte pronto.",
    });
  } catch (error) {
    console.error(`Error endpoint /api/auth/logout`, error);
  }
};
