// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { adminPartidosAdapter } from "@adapters/partidos/adminPartidos.adapter";
// STORE
import { useUserStore } from "@store/user.store";

/**
 * Service to fetch the admin list of matches (partidos) from the API.
 * @param {Object} params - Parameters for the service.
 * @param {string} [params.authToken] - Optional authentication token.
 * @param {AbortController} [params.controller] - Optional controller to abort the request.
 * @param {Function} [params.onSuccess] - Optional callback on success.
 * @param {Function} [params.onError] - Optional callback on error.
 * @returns {Promise<Array>} Resolves to the array of adapted admin matches.
 */
export const getAdminPartidosLista = async (params = {}) => {
  const { authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/partidos/lista-admin`,
      method: "GET",
      authToken,
      controller,
      onSuccess: (data) => {
        const adaptedData = adminPartidosAdapter(data);
        if (onSuccess) {
          onSuccess(adaptedData);
        }
      },
      onError: (code, error) => {
        console.error("Error fetching admin partidos list:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });

    return adminPartidosAdapter(response);
  } catch (error) {
    console.error("Error in getAdminPartidosLista service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};

/**
 * Service to update the result and status of a match.
 * @param {Object} data - Update data.
 * @param {number} data.partido_id - The match ID.
 * @param {number} data.goles_local - Goals for the home team.
 * @param {number} data.goles_visitante - Goals for the away team.
 * @param {string} data.estado - Status of the match (Programado, En Progreso, Finalizado).
 * @param {Object} params - Extra config parameters.
 * @param {string} [params.authToken] - Optional auth token.
 * @param {AbortController} [params.controller] - Optional AbortController.
 * @param {Function} [params.onSuccess] - Success callback.
 * @param {Function} [params.onError] - Error callback.
 * @returns {Promise<Object>} Resolves with the API response data.
 */
export const updatePartidoResultado = async (data, params = {}) => {
  const { authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/partidos/${data.partido_id}/resultado`,
      method: "PUT",
      data: {
        goles_local: data.goles_local,
        goles_visitante: data.goles_visitante,
        estado: data.estado,
      },
      authToken,
      controller,
      onSuccess: (resData) => {
        if (onSuccess) {
          onSuccess(resData);
        }
      },
      onError: (code, error) => {
        console.error("Error updating partido resultado:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });
    return response;
  } catch (error) {
    console.error("Error in updatePartidoResultado service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};
