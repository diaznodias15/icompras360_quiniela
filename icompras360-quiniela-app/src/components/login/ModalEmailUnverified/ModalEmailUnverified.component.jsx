// REACT
import { useCallback, useState } from "react";
// MANTINE
import { Button, Flex, Indicator, Text, ThemeIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// COMPONENTS
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
// CONTEXT
import { useUserFormContext } from "@context/login/login.context";
// LUCIDE
import { Mail, RefreshCcw } from "lucide-react";
// SERVICES
import { resendEmailUserVerification } from "@services/auth/login.services.jsx";

export const ModalEmailUnverified = ({
  isModalOpened = false,
  modalActions = { open: () => {}, close: () => {}, toggle: () => {} },
}) => {
  // RESPONSIVE
  const isMobile = useMediaQuery("(max-width: 768px)");

  // FORM
  const form = useUserFormContext();

  // STATES
  const [isLoading, setIsLoading] = useState(false);

  // FUNCTION
  const handleResendEmailVerification = useCallback(async () => {
    const requestData = {
      email: form.getValues().email,
    };
    const states = {
      setIsLoading: setIsLoading,
    };

    await resendEmailUserVerification(requestData, states);
  }, []);

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
      closeOnEscape={false}
      closeOnClickOutside={false}
      opened={isModalOpened}
      onClose={modalActions?.close}
      overlayProps={{ backgroundOpacity: 0.6, blur: 9, zIndex: 1200 }}
      styles={{
        header: modalHeaderStyles,
        content: modalContentStyles,
        body: modalBodyStyles,
        inner: modalInnerStyles,
      }}
      size={"md"}
      title={
        <Text fw={600} size={"xl"}>
          Tu cuenta aún no está verificada
        </Text>
      }
      zIndex={1200}
    >
      <Flex
        direction={"column"}
        gap={5}
        h={"100%"}
        justify={"space-between"}
        w={"100%"}
      >
        <Flex align={"center"} direction={"column"} gap={10} p={10}>
          <Indicator color={"warning"} offset={5} processing>
            <ThemeIcon color={"warning"} size={70} variant={"light"}>
              <Mail height={35} width={35} />
            </ThemeIcon>
          </Indicator>
          <Text fw={600} size={"xl"} ta={"center"}>
            Te hemos enviado anteriormente un enlace a tu correo electrónico
            para verificar tu cuenta.
          </Text>
          <Text c={"dimmed"} fw={400} size={"sm"} ta={"center"}>
            Si no lo encuentras en tu bandeja de entrada, por favor revisa la
            carpeta de correo no deseado o spam.
          </Text>
        </Flex>
        <Button
          data-autofocus
          loading={isLoading}
          fullWidth
          leftSection={<RefreshCcw />}
          mt={20}
          onClick={handleResendEmailVerification}
          size={"md"}
        >
          Reenviar correo de verificación
        </Button>
      </Flex>
    </AdaptiveModal>
  );
};
