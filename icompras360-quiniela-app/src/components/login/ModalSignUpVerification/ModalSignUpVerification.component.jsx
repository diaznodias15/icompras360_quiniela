// REACT
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// MANTINE
import {
  Alert,
  Badge,
  Button,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// COMPONENTS
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
// CONTEXT
import { useSignUpFormContext } from "@context/auth/signup.context";
// LUCIDE
import {
  Check,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  SquareUser,
} from "lucide-react";
// SERVICES
import { handleSignUp } from "@services/auth/sign_up.services";

// CONSTANTS
const INITIAL_FORM_VALUES = {
  reg_email: "",
  reg_document_type: "",
  reg_document_id: "",
  reg_country_code: "",
  reg_area_code: "",
  reg_phone_number: "",
};

export const ModalSignUpVerification = ({
  isModalOpened = false,
  modalActions = { open: () => {}, close: () => {}, toggle: () => {} },
}) => {
  // RESPONSIVE
  const isMobile = useMediaQuery("(max-width: 768px)");

  // NAVIGATE
  const navigate = useNavigate();

  // FORM
  const form = useSignUpFormContext();

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);

  // FUNCTIONS
  const onExitTransitionEnd = useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (form.isValid() == false) return;
    const requestData = form.getValues();
    const states = {
      setIsLoading: setIsLoading,
      navigate: navigate,
      modalActions: modalActions,
    };
    await handleSignUp(requestData, states);
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

  // EFFECTS
  useEffect(() => {
    if (isModalOpened) {
      setFormValues(form.getValues());
    }
  }, [isModalOpened]);

  return (
    <AdaptiveModal
      closeOnEscape={false}
      closeOnClickOutside={false}
      opened={isModalOpened}
      onClose={modalActions?.close}
      onExitTransitionEnd={onExitTransitionEnd}
      overlayProps={{ backgroundOpacity: 0.6, blur: 9, zIndex: 1200 }}
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{
        header: modalHeaderStyles,
        content: modalContentStyles,
        body: modalBodyStyles,
        inner: modalInnerStyles,
      }}
      size={"lg"}
      title={
        <Text fw={600} size={"xl"}>
          Confirmación de registro
        </Text>
      }
      withCloseButton={isLoading == false}
      zIndex={1200}
    >
      <Flex
        direction={"column"}
        gap={5}
        h={"100%"}
        justify={"space-between"}
        w={"100%"}
      >
        <Flex align={"center"} direction={"column"} gap={20} p={10}>
          <ThemeIcon color={"warning"} size={70} variant={"light"}>
            <ShieldCheck height={35} width={35} />
          </ThemeIcon>
          <Flex align={"center"} direction={"column"}>
            <Text fw={600} size={"xl"} ta={"center"}>
              ¿Son correctos tus datos?
            </Text>
            <Text c={"dimmed"} fw={400} size={"sm"} ta={"center"}>
              Por favor, valida cuidadosamente la información para tu registro
              como cliente. Estos datos se utilizarán para la firma del contrato
              digital y el acceso seguro a tu cuenta.
            </Text>
          </Flex>
          <Grid gap={20} w={"100%"}>
            <Grid.Col span={12}>
              <Paper
                bg={"section"}
                c={"for-section"}
                p={10}
                w={"100%"}
                withBorder
              >
                <Flex gap={10}>
                  <ThemeIcon color={"primary"} size={50}>
                    <Mail size={30} />
                  </ThemeIcon>
                  <Flex direction={"column"} gap={5} w={"100%"}>
                    <Text c={"primary"} fw={600} size={"sm"}>
                      CORREO ELECTRÓNICO DE CONTACTO
                    </Text>
                    <Text fw={700} size={"lg"}>
                      {formValues?.reg_email}
                    </Text>
                    <Badge color={"warning"} variant="light">
                      Se enviará un enlace de verificación a tu correo
                      electrónico
                    </Badge>
                  </Flex>
                </Flex>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper
                bg={"section"}
                c={"for-section"}
                h={"100%"}
                p={10}
                w={"100%"}
                withBorder
              >
                <Flex gap={10}>
                  <ThemeIcon color={"primary"} size={"lg"}>
                    <SquareUser size={20} />
                  </ThemeIcon>
                  <Flex direction={"column"} w={"100%"}>
                    <Text c={"dimmed"} fw={600} size={"xs"}>
                      DOCUMENTO DE IDENTIDAD
                    </Text>
                    <Text fw={700} size={"lg"}>
                      {`${formValues?.reg_document_type} - ${formValues?.reg_document_id}`}
                    </Text>
                    <Text c={"dimmed"} size={"sm"}>
                      Para fines tributarios.
                    </Text>
                  </Flex>
                </Flex>
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper
                bg={"section"}
                c={"for-section"}
                h={"100%"}
                p={10}
                w={"100%"}
                withBorder
              >
                <Flex gap={10}>
                  <ThemeIcon color={"primary"} size={"lg"}>
                    <Phone size={20} />
                  </ThemeIcon>
                  <Flex direction={"column"} w={"100%"}>
                    <Text c={"dimmed"} fw={700} size={"xs"}>
                      NÚMERO DE TELÉFONO
                    </Text>
                    <Text fw={700} size={"lg"}>
                      {`${formValues?.reg_country_code} (${formValues?.reg_area_code}) ${formValues?.reg_phone_number}`}
                    </Text>
                    <Text c={"dimmed"} size={"sm"}>
                      Para fines tributarios.
                    </Text>
                  </Flex>
                </Flex>
              </Paper>
            </Grid.Col>
          </Grid>
          <Alert color={"warning"} w={"100%"}>
            <Flex gap={10}>
              <ThemeIcon color={"warning"} size={"md"} variant={"transparent"}>
                <Info size={20} />
              </ThemeIcon>
              <Flex direction={"column"}>
                <Text c={"warning"} fw={600} size={"sm"} span>
                  PROCESO DE VERIFICACIÓN OBLIGATORIO
                </Text>
                <Text c={"warning"} size={"xs"} span>
                  para activar tu cuenta y proceder, enviaremos un correo
                  electrónico al correo electrónico registrado. Deberás ingresar
                  y pulsar el botón de validación para finalizar tu registro.
                </Text>
              </Flex>
            </Flex>
          </Alert>
        </Flex>
        <Button
          data-autofocus
          loading={isLoading}
          fullWidth
          leftSection={<Check />}
          mt={20}
          onClick={handleSubmit}
          size={"md"}
        >
          Confirmo que los datos ingresados son correctos.
        </Button>
      </Flex>
    </AdaptiveModal>
  );
};
