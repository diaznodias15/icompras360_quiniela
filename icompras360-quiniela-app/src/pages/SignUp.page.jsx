// REACT
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
// MANTINE
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Flex,
  Group,
  Image,
  Paper,
  PasswordInput,
  Popover,
  Progress,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
// COMPONENTS
import { VisibilityToggleIcon } from "@components/login/VisibilityToggleIcon/VisibilityToggleIcon.component";
// CONTEXT
import {
  SignUpFormProvider,
  useSignUpForm,
} from "@context/auth/signup.context";
// LUCIDE
import { AtSign, Check, Info, RectangleEllipsis, Lock, X } from "lucide-react";
// ROUTER
import { PublicRoutes } from "@router/routes.router";
// SERVICES
import { handleSignUp } from "@services/auth/sign_up.services.jsx";
// STYLES
import classes from "@styles/global.module.css";
// UTILITIES
import { isEmailValid } from "@utilities/validations";

const requirements = [
  { re: /[0-9]/, label: "Necesita al menos un número" },
  { re: /[a-z]/, label: "Necesita al menos una letra minúscula" },
  { re: /[A-Z]/, label: "Necesita al menos una letra mayúscula" },
  { re: /[$&+,:;=?@#<>.^*()%!-]/, label: "Necesita al menos un símbolo" },
];

function getStrength(password) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function PasswordRequirement({ meets, label }) {
  return (
    <Flex align="center" gap={5} w={"100%"}>
      <ThemeIcon color={meets ? "success" : "danger"} size={"sm"}>
        {meets ? <Check size={14} /> : <X size={14} />}
      </ThemeIcon>
      <Text c={meets ? "success" : "danger"} size="xs">
        {label}
      </Text>
    </Flex>
  );
}

const SignUp = () => {
  // NAVIGATION
  const navigate = useNavigate();

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useInputState("");
  const strength = getStrength(passwordValue);

  // FORM
  const form = useSignUpForm({
    mode: "uncontrolled",
    initialValues: {
      reg_email: "",
      reg_password: "",
      reg_confirm_password: "",
    },

    validate: {
      reg_email: (value) => isEmailValid(value),
      reg_password: (value) => {
        if (value.length < 8)
          return "La contraseña debe tener al menos 8 caracteres";
        const error = requirements.find((requirement) => {
          if (!requirement.re.test(value)) {
            return requirement.label;
          }
        });
        return error ? error.label : null;
      },
      reg_confirm_password: (value) => {
        if (value.length < 8)
          return "La contraseña debe tener al menos 8 caracteres";
        const error = requirements.find((requirement) => {
          if (!requirement.re.test(value)) {
            return requirement.label;
          }
        });
        return error ? error.label : null;
      },
    },
  });

  // FUNCTION
  const handleSubmit = useCallback(async (values) => {
    const states = {
      navigate: navigate,
      setIsLoading: setIsLoading,
    };
    await handleSignUp(values, states);
  }, []);

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: "0ms" } }}
        value={
          passwordValue.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
              ? 100
              : 0
        }
        color={strength > 80 ? "success" : strength > 50 ? "yellow" : "danger"}
        key={index}
        size={4}
      />
    ));

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(passwordValue)}
    />
  ));

  // WATCH
  form.watch("reg_password", ({ value }) => {
    setPasswordValue(value);
  });

  return (
    <SignUpFormProvider form={form}>
      <Flex
        align={"center"}
        bg={"background"}
        className="grow"
        mih={"100vh"}
        justify={"center"}
        py={50}
        px={10}
        w={"100%"}
      >
        <Flex
          align={"center"}
          direction={"column"}
          gap={5}
          maw={600}
          w={"100%"}
        >
          <Paper
            bg="section"
            c={"for-section"}
            px={10}
            py={20}
            shadow={"sm"}
            withBorder
          >
            <Flex align="center" justify="center">
              <Image
                alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
                darkHidden
                fit={"contain"}
                h={100}
                src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
                w={{ base: 130, xs: 170 }}
              />
              <Image
                alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
                lightHidden
                fit={"contain"}
                h={100}
                src={`${import.meta.env.BASE_URL}img/logo-dark.webp`}
                w={{ base: 130, xs: 170 }}
              />
            </Flex>
            <Text size="4xl" ta={"center"}>
              Registro
            </Text>
            <Flex
              align={"center"}
              gap={10}
              justify={"center"}
              mt={10}
              w={"100%"}
            >
              <Text size="md">¿Ya tienes una cuenta?</Text>
              <Anchor
                c={"for-background"}
                className={classes.navbarItem}
                component={Link}
                fw={600}
                replace={true}
                to={PublicRoutes.LOGIN.route}
                underline="never"
              >
                ¡Inicia sesión!
              </Anchor>
            </Flex>
            <form
              className="w-full"
              onSubmit={form.onSubmit(
                (values) => handleSubmit(values),
                (errors) => {
                  const firstErrorPath = Object.keys(errors)[0];
                  form.getInputNode(firstErrorPath)?.focus();
                },
              )}
            >
              <Flex direction={"column"} gap={10} p={10} w={"100%"}>
                <Flex direction={"column"} w={"100%"}>
                  <Text c={"dimmed"} size={"sm"}>
                    Crea tu cuenta para empezar a comprar
                  </Text>
                  <Alert color="warning">
                    <Flex direction={"column"} gap={5} w={"100%"}>
                      <Flex align={"center"} c={"warning"} fw={500} gap={5}>
                        <ThemeIcon size={"xs"}>
                          <Info />
                        </ThemeIcon>
                        <Text fw={600}>Mensaje importante</Text>
                      </Flex>
                      <Text fw={500} size="sm">
                        Para que su PREDICCIÓN sea válida se debe registrar con
                        su correo asociado a la plataforma de ICOMPRAS360.
                      </Text>
                    </Flex>
                  </Alert>
                </Flex>
                <TextInput
                  aria-label="Correo electrónico"
                  data-autofocus
                  key={form.key("reg_email")}
                  label="Correo electrónico"
                  leftSection={<AtSign />}
                  placeholder="Ejemplo: usuario@example.com"
                  size="md"
                  {...form.getInputProps("reg_email")}
                />
                <Flex direction={"column"} w={"100%"}>
                  <Text fw={500}>Contraseña</Text>
                  <Flex align={"center"} gap={5} w={"100%"}>
                    <PasswordInput
                      aria-label="Contraseña"
                      className={"grow"}
                      key={form.key("reg_password")}
                      leftSection={<RectangleEllipsis />}
                      placeholder="Ingresa tu contraseña"
                      visibilityToggleIcon={VisibilityToggleIcon}
                      size="md"
                      {...form.getInputProps("reg_password")}
                    />
                    <Popover
                      width={250}
                      position={"top-end"}
                      clickOutsideEvents={["mouseup", "touchend"]}
                      zIndex={1100}
                    >
                      <Popover.Target>
                        <ActionIcon
                          color={
                            strength > 80
                              ? "success"
                              : strength > 50
                                ? "yellow"
                                : "danger"
                          }
                        >
                          {strength > 80 ? <Check /> : <Info />}
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Flex direction={"column"} gap={5}>
                          <PasswordRequirement
                            label="Necesita al menos 8 caracteres"
                            meets={passwordValue.length > 7}
                          />
                          {checks}
                        </Flex>
                      </Popover.Dropdown>
                    </Popover>
                  </Flex>
                  <Group gap={5} grow mt="xs">
                    {bars}
                  </Group>
                </Flex>
                <PasswordInput
                  aria-label="Contraseña"
                  key={form.key("reg_confirm_password")}
                  label="Confirmar contraseña"
                  leftSection={<RectangleEllipsis />}
                  placeholder="Ingresa nuevamente tu contraseña"
                  rightSection={<Lock />}
                  size="md"
                  {...form.getInputProps("reg_confirm_password")}
                />
                <Button loading={isLoading} size="md" type="submit">
                  Registrarme
                </Button>
              </Flex>
            </form>
          </Paper>
        </Flex>
      </Flex>
    </SignUpFormProvider>
  );
};

export default SignUp;
