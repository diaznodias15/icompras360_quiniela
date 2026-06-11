import { axiosRequest } from "@utilities/axiosRequest";
import { rankingAdapter } from "@adapters/users/ranking.adapter";
import { useUserStore } from "@store/user.store";

export const getRanking = async (params = {}) => {
  const { authToken, controller, onSuccess, onError } = params;
  try {
    const response = await axiosRequest({
      url: `/api/users/ranking`,
      method: "GET",
      authToken,
      controller,
      onSuccess: (data) => {
        const adaptedData = rankingAdapter(data);
        if (onSuccess) {
          onSuccess(adaptedData);
        }
      },
      onError: (code, error) => {
        console.error("Error fetching ranking:", code, error);
        if (code === 401) {
          useUserStore.getState().reset();
        }
        if (onError) {
          onError(code, error);
        }
      },
    });

    return rankingAdapter(response);
  } catch (error) {
    console.error("Error in getRanking service:", error);
    if (error?.status === 401 || error?.response?.status === 401) {
      useUserStore.getState().reset();
    }
    throw error;
  }
};