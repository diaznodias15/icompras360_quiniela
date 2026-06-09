// REACT
import { useState } from "react";
// MANTINE
import { Button, Flex, Text, ThemeIcon } from "@mantine/core";
// HOOKS
import { useMediaQuery } from "@mantine/hooks";
// COMPONENTS
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
// LUCIDE
import { CircleAlert, LogOut } from "lucide-react";
// SERVICES
import { logOut } from "@services/auth/login.services";
// STORE
import { useUserStore } from "@store/user.store";

export const ModalLogout = ({ isModalOpened, modalActions }) => {
  // RESPONSIVE
  const isMobile = useMediaQuery("(max-width: 768px)");

  // STATES
  const [isLoading, setIsLoading] = useState(false);

  // STORE
  const storeData = {
    logout: useUserStore((state) => state.reset),
    token: useUserStore((state) => state.token),
  };

  // FUNCTIONS
  const handleCloseModal = () => {
    modalActions.close();
  };

  const handleLogout = async () => {
    const states = {
      setIsLoading: setIsLoading,
      modalActions: modalActions,
    };
    await logOut(states, storeData);
  };

  // STYLES
  const modalHeaderStyles = {
    backgroundColor: "var(--mantine-color-background-5)",
    color: "var(--mantine-color-for-background-5)",
  };

  const modalContentStyles = {
    backgroundColor: "var(--mantine-color-background-5)",
    borderRadius: isMobile
      ? "var(--mantine-radius-default) var(--mantine-radius-default) 0 0"
      : "var(--mantine-radius-default)",
    color: "var(--mantine-color-for-background-5)",
    display: "flex",
    flexDirection: "column",
  };

  const modalBodyStyles = {
    height: "100%",
  };

  const modalInnerStyles = {
    zIndex: 1200,
  };
  return (
    <AdaptiveModal
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={handleCloseModal}
      overlayProps={{ backgroundOpacity: 0.6, blur: 9, zIndex: 1100 }}
      opened={isModalOpened}
      size={"md"}
      styles={{
        header: modalHeaderStyles,
        content: modalContentStyles,
        body: modalBodyStyles,
        inner: modalInnerStyles,
      }}
      title={
        <Text fw={600} size={"xl"}>
          Cerrar sesión
        </Text>
      }
      zIndex={1100}
    >
      <Flex
        direction={"column"}
        gap={5}
        h={"100%"}
        justify={"space-between"}
        w={"100%"}
      >
        <Flex
          align={"center"}
          direction={"column"}
          gap={20}
          justify={"center"}
          w={"100%"}
        >
          <ThemeIcon color={"blue"} size={60} variant={"light"}>
            <CircleAlert height={40} width={40} />
          </ThemeIcon>
          <Text fw={400} size={"lg"}>
            ¿Estás seguro de que quieres{" "}
            <Text fw={600} span>
              salir de tu cuenta
            </Text>
            ?
          </Text>
        </Flex>
        <Flex direction={"column"} gap={10} justify={"flex-end"} w={"100%"}>
          <Button
            fullWidth
            leftSection={<LogOut />}
            loading={isLoading}
            onClick={() => handleLogout()}
            size={"md"}
          >
            Sí, deseo cerrar sesión
          </Button>
        </Flex>
      </Flex>
    </AdaptiveModal>
  );
};
