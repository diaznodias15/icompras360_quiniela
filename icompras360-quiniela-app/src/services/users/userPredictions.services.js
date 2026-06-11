// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { userPredictionsAdapter } from "@adapters/users/userPredictions.adapter";
// STORE
import { useUserStore } from "@store/user.store";

/**
 * Service to fetch a specific user's predictions from the API.
 * @param {Object} params - Parameters for the service.
 * @param {number} params.userId - The user ID to fetch predictions for.
 * @param {string} [params.authToken] - Optional authentication token.
 * @param {AbortController} [params.controller] - Optional controller to abort the request.
 * @param {Function} [params.onSuccess] - Optional callback on success. Receives adapted predictions.
 * @param {Function} [params.onError] - Optional callback on error.
 * @returns {Promise<Array>} Resolves to the array of adapted predictions.
 */
export const getUserPredictions = async (params = {}) => {
  const { userId, authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/users/${userId}/predicciones`,
      method: "GET",
      authToken,
      controller,
      onSuccess: (data) => {
        const adaptedData = userPredictionsAdapter(data);
        if (onSuccess) {
          onSuccess(adaptedData);
        }
      },
      onError: (code, error) => {
        console.error("Error fetching user predictions:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });

    return userPredictionsAdapter(response);
  } catch (error) {
    console.error("Error in getUserPredictions service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};