// REACT
import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
// MANTINE
import {
  Anchor,
  Button,
  Flex,
  Grid,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  useMatches,
} from "@mantine/core";
import { useDocumentTitle, useDisclosure, useMediaQuery } from "@mantine/hooks";
// COMPONENTS
import { ServerError } from "@components/common/ServerError/ServerError.component";
import { VisibilityToggleIcon } from "@components/login/VisibilityToggleIcon/VisibilityToggleIcon.component";
// CONTEXT
import { UserFormProvider, useUserForm } from "@context/login/login.context";
import { AppContext } from "@context/app.context";
// LUCIDE
import { AtSign, LogIn, RectangleEllipsis } from "lucide-react";
// ROUTER
import { PublicRoutes, PrivateRoutes } from "@router/routes.router";
// SERVICES
import { handleLogIn } from "@services/auth/login.services";
// STORE
import { useUserStore } from "@store/user.store";
// STYLES
import classes from "@styles/global.module.css";
// UTILITIES
import { isEmailValid, isPasswordValid } from "@utilities/validations.js";

const envVariables = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
};

const Login = () => {
  // APP TITLE
  useDocumentTitle(`${envVariables.APP_NAME} - Login`);

  // CONTEXT
  const { appConfig } = useContext(AppContext);

  // RESPONSIVE
  const isMobile = useMediaQuery("(max-width: 768px)");
  const imageWidth = useMatches({ base: 130, xs: 200 });

  // NAVIGATE
  const navigate = useNavigate();

  // MANTINE HOOKS
  const [isLoading, isLoadingActions] = useDisclosure(false);
  useDisclosure(false);

  // STORE
  const token = useUserStore((state) => state.token);
  const storeData = {
    setUserID: useUserStore((state) => state.setId),
    setUserEmail: useUserStore((state) => state.setEmail),
    setUserToken: useUserStore((state) => state.setToken),
  };

  // REF
  const controllerRef = useRef(null);

  // FORM
  const form = useUserForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => isEmailValid(value),
      password: (value) => isPasswordValid(value, false),
    },
  });

  // FUNCTIONS
  const handleSubmit = async (values) => {
    const states = {
      isLoadingActions: isLoadingActions,
      navigate: navigate,
    };
    await handleLogIn(values, controllerRef.current, states, storeData);
  };

  // EFFECTS
  useEffect(() => {
    if (token) navigate(`${PrivateRoutes.PREDICTIONS.route}`);
    controllerRef.current = new AbortController();

    return () => {
      controllerRef.current.abort();
    };
  }, []);

  if (token) return null;
  if (appConfig.is_show_user === 0)
    return (
      <ServerError
        code={404}
        title={"Lo sentimos"}
        subtle={"Módulo en mantenimiento"}
        isShowBackButton={true}
      />
    );

  return (
    <UserFormProvider form={form}>
      <Flex
        align={"center"}
        bg={"background"}
        direction={"column"}
        className="grow"
        mih={"100vh"}
        gap={20}
        justify={"start"}
        py={50}
        px={10}
        w={"100%"}
      >
        <Paper
          bg={"section"}
          c={"for-section"}
          className={"overflow-hidden"}
          maw={600}
          px={10}
          py={20}
          shadow="xl"
          w={"100%"}
        >
          <Flex
            align={"center"}
            c={"for-background"}
            direction={"column"}
            justify={"center"}
            w={"100%"}
          >
            <Flex align="center" justify="center">
              <Image
                alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
                darkHidden
                fit={"contain"}
                h={100}
                src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
                w={imageWidth}
              />
              <Image
                alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
                lightHidden
                fit={"contain"}
                h={100}
                src={`${import.meta.env.BASE_URL}img/logo-dark.webp`}
                w={imageWidth}
              />
            </Flex>
            <Text size="4xl">Bienvenido</Text>
            <Flex
              align={"center"}
              gap={10}
              justify={"center"}
              mt={10}
              w={"100%"}
            >
              <Text size="md">¿No tienes cuenta?</Text>
              <Anchor
                c={"for-background"}
                className={classes.navbarItem}
                fw={600}
                component={Link}
                replace={true}
                to={PublicRoutes.SIGNUP.route}
                underline="never"
              >
                ¡Registrate!
              </Anchor>
            </Flex>
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
            <Flex w={"100%"} justify={"center"}>
              <Flex direction={"column"} gap={10} w={"100%"}>
                <TextInput
                  aria-label="Correo electrónico"
                  autoComplete="email"
                  autoFocus
                  c="for-section"
                  disabled={isLoading}
                  key={form.key("email")}
                  label="Correo electrónico"
                  leftSection={
                    <Flex c={"dimmed"}>
                      <AtSign />
                    </Flex>
                  }
                  placeholder="Ejemplo: usuario@example.com"
                  size="md"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  aria-label="Contraseña"
                  autoComplete="current-password"
                  c="for-section"
                  disabled={isLoading}
                  key={form.key("password")}
                  label="Contraseña"
                  leftSection={
                    <Flex c={"dimmed"}>
                      <RectangleEllipsis />
                    </Flex>
                  }
                  placeholder="Ingresa tu contraseña"
                  visibilityToggleIcon={VisibilityToggleIcon}
                  size="md"
                  {...form.getInputProps("password")}
                />
                <Flex justify={"flex-end"} w={"100%"}>
                  <Button
                    loading={isLoading}
                    fullWidth={isMobile}
                    leftSection={<LogIn />}
                    size="md"
                    type="submit"
                  >
                    Entrar
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        </Paper>
      </Flex>
    </UserFormProvider>
  );
};

export default Login;
