// MANTINE
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";

export const handleResetPassword = async (data, states, token) => {
  try {
    const { isLoadingActions, reset, handleCloseModal } = states;
    isLoadingActions.open();
    await axiosRequest({
      url: `/api/auth/reset-password`,
      method: "POST",
      data: {
        old_password: data.reg_old_password,
        new_password: data.reg_password,
        new_password_confirmation: data.reg_confirm_password,
      },
      authToken: token,
      onSuccess: (response) => {
        notifications.show({
          color: "success",
          message: response.message,
          title: response.status,
        });
        isLoadingActions.close();
        handleCloseModal();
      },
      onError: (code, error) => {
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        console.error(
          "Error al cambiar la contraseña: ",
          error.status,
          " | ",
          error.message,
        );
        if (code === 401) {
          reset();
        }
        isLoadingActions.close();
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
  }
};
