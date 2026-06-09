// MANTINE
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";
// ADAPTERS
import { loginAdapter } from "@adapters/auth/login.adapter";
// ROUTER
import { PublicRoutes } from "@router/routes.router";

const handleMergeCartItems = async (user, controller, storeData) => {
  try {
    if (storeData.cartProducts.length == 0) return false;
    const requestData = {
      products: storeData.cartProducts.map((product) => {
        return {
          tx_slug: product.tx_slug,
          qty_product: product.qty_product,
        };
      }),
    };
    await axiosRequest({
      url: `/api/cart/merge/branch/${user.branch_id}`,
      method: "POST",
      data: requestData,
      authToken: user.token,
      controller: controller,
      onSuccess: (response) => {
        storeData.resetCart();
        console.info("Items del carrito agregados correctamente");
      },
      onError: (code, error) => {
        console.error(
          "Error al agregar los productos al carrito: ",
          error.message,
        );
      },
    });
  } catch (error) {
    console.error("Error al agregar los productos al carrito: ", error.message);
  }
};

export const handleLogIn = async (data, controller, states, storeData) => {
  try {
    const { isLoadingActions, isModalEmailUnverifiedActions, navigate } =
      states;
    isLoadingActions.open();
    await axiosRequest({
      url: `/api/auth/login`,
      method: "POST",
      data: {
        email: data.email,
        password: data.password,
      },
      controller: controller,
      onSuccess: async (response) => {
        const loginAdapted = loginAdapter(response);
        await handleMergeCartItems(
          { ...loginAdapted, branch_id: data.branch_id },
          controller,
          storeData,
        );
        storeData.setUserID(loginAdapted.id);
        storeData.setUserEmail(loginAdapted.email);
        storeData.setUserName(loginAdapted.name);
        storeData.setUserPhone(loginAdapted.tx_phone);
        storeData.setUserToken(loginAdapted.token);
        storeData.setUserCreatedAt(loginAdapted.created_at);
        isLoadingActions.close();
        if (window.history.length <= 1) {
          navigate(`${PublicRoutes.HOME.route}`, { replace: true });
        } else {
          navigate(-1);
        }
        notifications.show({
          color: "success",
          message: (
            <Text>
              Bienvenido(a),{" "}
              <Text fw={600} span>
                {loginAdapted.name}.
              </Text>
            </Text>
          ),
        });
      },
      onError: (code, error) => {
        console.error("Error al iniciar sesión: ", code, " | ", error.message);
        switch (code) {
          case 403:
            isModalEmailUnverifiedActions.open();
            break;
          default:
            notifications.show({
              color: "danger",
              message: error.message,
              title: error.status,
            });
            break;
        }
        isLoadingActions.close();
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
  }
};

export const resendEmailUserVerification = async (data, states) => {
  try {
    const { setIsLoading } = states;
    setIsLoading(true);
    await axiosRequest({
      url: `/api/auth/send-email-verification`,
      method: "POST",
      data: {
        email: data.email,
      },
      onSuccess: async (response) => {
        notifications.show({
          color: "success",
          title: "OK",
          message: response.message,
        });
        setIsLoading(false);
      },
      onError: (code, error) => {
        console.error(
          "Error al reenviar el correo de verificación: ",
          code,
          " | ",
          error.message,
        );
        notifications.show({
          color: "danger",
          message: error.message,
          title: error.status,
        });
        setIsLoading(false);
      },
    });
  } catch (error) {
    console.error(`Error endpoint /api/auth/send-email-verification`, error);
  }
};

export const verifyEmail = async (data, states) => {
  try {
    const { setIsLoading, setIsError } = states;
    setIsLoading(true);
    await axiosRequest({
      url: `/api/auth/account/verify/${data.id}/${data.token}`,
      method: "GET",
      onSuccess: async (response) => {
        setIsLoading(false);
      },
      onError: (code, error) => {
        console.error(
          "Error al verificar la cuenta: ",
          code,
          " | ",
          error.message,
        );
        setIsError(true);
        setIsLoading(false);
      },
    });
  } catch (error) {
    console.error(`Error endpoint /api/auth/account/verify`, error);
  }
};

export const logOut = async (states, storeData) => {
  try {
    const { token, logout } = storeData;
    const { setIsLoading, modalActions } = states;
    setIsLoading(true);
    await axiosRequest({
      url: `/api/auth/logout`,
      method: "POST",
      authToken: token,
      onSuccess: async (response) => {
        logout();
        setIsLoading(false);
      },
      onError: (code, error) => {
        console.error("Error al cerrar sesión: ", code, " | ", error.message);
        logout();
        setIsLoading(false);
      },
    });
    notifications.show({
      color: "success",
      title: "OK",
      message: "Has cerrado sesión correctamente, esperamos verte pronto.",
    });
    modalActions.close();
  } catch (error) {
    console.error(`Error endpoint /api/auth/logout`, error);
  }
};
