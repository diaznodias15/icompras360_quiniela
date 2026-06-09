// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { partidosAdapter } from "@adapters/partidos/partidos.adapter";
// STORE
import { useUserStore } from "@store/user.store";

/**
 * Service to fetch the list of matches (partidos) from the API.
 * @param {Object} params - Parameters for the service.
 * @param {string} [params.authToken] - Optional authentication token.
 * @param {AbortController} [params.controller] - Optional controller to abort the request.
 * @param {Function} [params.onSuccess] - Optional callback on success. Receives adapted matches.
 * @param {Function} [params.onError] - Optional callback on error.
 * @returns {Promise<Array>} Resolves to the array of adapted matches.
 */
export const getPartidosLista = async (params = {}) => {
  const { authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/partidos/lista`,
      method: "GET",
      authToken,
      controller,
      onSuccess: (data) => {
        const adaptedData = partidosAdapter(data);
        if (onSuccess) {
          onSuccess(adaptedData);
        }
      },
      onError: (code, error) => {
        console.error("Error fetching partidos list:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });

    return partidosAdapter(response);
  } catch (error) {
    console.error("Error in getPartidosLista service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};
