// MANTINE
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";

export const onSendEmailResetPassword = async (data, states) => {
  try {
    const { isLoadingActions, nextStep } = states;
    isLoadingActions.open();

    await axiosRequest({
      url: `/api/auth/validate-user`,
      method: "POST",
      data: {
        email: data.email,
      },
      onSuccess: (response) => {
        notifications.show({
          autoClose: 10000,
          color: "success",
          message: response.message,
          title: "Email enviado correctamente",
        });
        // QUITAR EL LOADING Y CAMBIO DE PASO
        isLoadingActions.close();
        nextStep();
      },
      onError: (code, error) => {
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        console.error(
          "Error al confirmar el email : ",
          error.status,
          " | ",
          error.message,
        );
        isLoadingActions.close();
      },
    });
    return;
  } catch (error) {
    console.error("Error al confirmar el email: ", error);
  }
};

export const onValidateResetPIN = async (data, states) => {
  try {
    const { isLoadingActions, nextStep } = states;
    isLoadingActions.open();

    await axiosRequest({
      url: `/api/auth/validate-pin`,
      method: "POST",
      data: {
        email: data.email,
        pin: data.pin,
      },
      onSuccess: (response) => {
        notifications.show({
          color: "success",
          message: response.message,
          title: response.status,
        });
        // QUITAR EL LOADING Y CAMBIO DE PASO
        isLoadingActions.close();
        nextStep();
      },
      onError: (code, error) => {
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        isLoadingActions.close();
      },
    });
  } catch (error) {
    console.error("Error al confirmar el PIN: ", error);
  }
};

export const onRestorePassword = async (data, states) => {
  try {
    const { isLoadingActions, nextStep } = states;
    isLoadingActions.open();

    await axiosRequest({
      url: `/api/auth/restore-password`,
      method: "POST",
      data: {
        email: data.email,
        pin: data.pin,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      onSuccess: (response) => {
        notifications.show({
          color: "success",
          message: response.message,
          title: response.status,
        });
        // QUITAR EL LOADING Y CAMBIO DE PASO
        isLoadingActions.close();
        nextStep();
      },
      onError: (code, error) => {
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        isLoadingActions.close();
      },
    });
  } catch (error) {
    console.error(error);
  }
};
