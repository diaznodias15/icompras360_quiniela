// MANTINE
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ROUTER
import { PublicRoutes } from "@router/routes.router";

export const handleSignUp = async (data, states) => {
  try {
    states.setIsLoading(true);
    axiosRequest({
      url: `/api/users/register`,
      method: "POST",
      data: {
        email: data.reg_email,
        password: data.reg_password,
      },
      onSuccess: (response) => {
        notifications.show({
          color: "success",
          message: response.message,
          title: "OK",
        });
        states.setIsLoading(false);
        states.navigate(PublicRoutes.LOGIN.route, { replace: true });
      },
      onError: (code, error) => {
        states.setIsLoading(false);
        console.error(
          "Error al registrar: ",
          error.status,
          " | ",
          error.message,
        );
        notifications.show({
          autoClose: 5000,
          color: "danger",
          message: error.message,
          title: error.status,
        });
      },
    });
  } catch (error) {
    console.error(`/api/users/register`, error);
  }
};
