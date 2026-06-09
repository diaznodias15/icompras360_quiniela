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
        document_type: data.reg_document_type,
        document_id: data.reg_document_id,
        name: data.reg_name,
        address: data.reg_address,
        password: data.reg_password,
        id_gender: data.reg_gender,
        country_code: data.reg_country_code,
        area_code: data.reg_area_code,
        phone_number: data.reg_phone_number,
        terms_of_service: data.reg_accept_terms_and_conditions,
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
        states.modalActions.close();
      },
    });
  } catch (error) {
    console.error(`/api/users/register`, error);
  }
};
