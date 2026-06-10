import { axiosRequest } from "@utilities/axiosRequest";
import { estadisticasAdapter } from "@adapters/users/estadisticas.adapter";
import { useUserStore } from "@store/user.store";

export const getEstadisticasUsuario = async (params = {}) => {
  const { authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/users/estadisticas`,
      method: "GET",
      authToken,
      controller,
      onSuccess: (data) => {
        const adaptedData = estadisticasAdapter(data);
        if (onSuccess) {
          onSuccess(adaptedData);
        }
      },
      onError: (code, error) => {
        console.error("Error fetching estadisticas:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });

    return estadisticasAdapter(response);
  } catch (error) {
    console.error("Error in getEstadisticasUsuario service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};