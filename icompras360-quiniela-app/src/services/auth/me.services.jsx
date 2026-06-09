// MANTINE
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { loginAdapter } from "@adapters/auth/login.adapter";

export const handleGetUser = async (storeData) => {
  try {
    if (!storeData.userToken) return;
    await axiosRequest({
      url: `/api/auth/me`,
      method: "GET",
      authToken: storeData.userToken,
      onSuccess: (response) => {
        const loginAdapted = loginAdapter(response);
        storeData.setUserID(loginAdapted.id);
        storeData.setUserEmail(loginAdapted.email);
        storeData.setUserName(loginAdapted.name);
        storeData.setUserPhone(loginAdapted.tx_phone);
        storeData.setUserToken(loginAdapted.token);
        storeData.setUserCreatedAt(loginAdapted.created_at);
      },
      onError: (code, error) => {
        console.error("Error al obtener el usuario logueado: ", error.message);
        storeData.reset();
        notifications.show({
          autoClose: 5000,
          color: "danger",
          message:
            "Se ha cerrado la sesión, por favor inicie sesión nuevamente",
          title: "ERROR",
        });
      },
    });
  } catch (error) {
    console.error("Error al obtener el usuario logueado :", error);
  }
};
