// REACT
import { memo, useContext } from "react";
import { Link, useLocation } from "react-router";
// MANTINE
import {
  Anchor,
  Avatar,
  Button,
  Divider,
  Flex,
  HoverCard,
  Image,
  NavLink,
  NumberFormatter,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";
// COMPONENTS
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component";
import { ThemeButton } from "@components/common/ThemeButton/ThemeButton.component";
// CONTEXT
import { AppContext } from "@context/app.context";
// LUCIDE
import { LogIn, LogOut, MapPin, RefreshCw, User } from "lucide-react";
// ROUTER
import { PublicRoutes } from "@router/routes.router";
// STORE
import { useUserStore } from "@store/user.store";
// STYLES
import classes from "@styles/global.module.css";

const NavbarLogo = () => {
  // NAVIGATION
  const location = useLocation();

  // FUNCTIONS
  const handleScrollToTop = () => {
    if (location.pathname === PublicRoutes.HOME.route) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Anchor
      c="for-navbar"
      component={Link}
      onClick={() => handleScrollToTop()}
      underline="never"
    >
      <Flex align="center" justify="center">
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          darkHidden
          fit={"contain"}
          h={70}
          src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
          w={150}
        />
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          lightHidden
          fit={"contain"}
          h={70}
          src={`${import.meta.env.BASE_URL}img/logo-dark.webp`}
          w={150}
        />
      </Flex>
    </Anchor>
  );
};

const NavbarButtons = () => {
  // CONTEXT
  const { modalLogoutActions } = useContext(AppContext);

  // STORE
  const userID = useUserStore((state) => state.id);
  const userEmail = useUserStore((state) => state.email);

  return (
    <Flex align="center" gap={10} h={"100%"} justify="flex-end">
      <Flex>
        <ThemeButton />
      </Flex>
      <Flex>
        <HoverCard offset={0} position={"bottom-center"} withArrow>
          <HoverCard.Target>
            <UnstyledButton
              aria-label="Abrir menú de usuario"
              c={"for-navbar"}
              className={classes.navbarButton}
              h={45}
              maw={150}
              w={"100%"}
            >
              <Flex align="center" gap={10} miw={0} w="100%">
                {!userID ? (
                  <User style={{ flexShrink: 0 }} />
                ) : (
                  <Avatar color="primary" size={35} name={userEmail}></Avatar>
                )}
                <Flex
                  align={"flex-start"}
                  direction={"column"}
                  miw={0}
                  justify={"center"}
                  w={"100%"}
                >
                  {userEmail && (
                    <>
                      <Text fw={500} lineClamp={1} size={"xs"} w={"100%"}>
                        {userEmail}
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            </UnstyledButton>
          </HoverCard.Target>
          <HoverCard.Dropdown style={{ zIndex: 1004 }} p={0} w={200}>
            <Flex
              align={"center"}
              direction={"column"}
              justify={"center"}
              gap={5}
              p={10}
              w={200}
            >
              {!userID && (
                <Avatar color="primary" size={50} name={userName}>
                  <User height={30} width={30} />
                </Avatar>
              )}
              <Flex
                align={"center"}
                direction={"column"}
                justify={"center"}
                w={"100%"}
              >
                {!userID && (
                  <>
                    <Text
                      fw={600}
                      lineClamp={2}
                      size={"sm"}
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        wordBreak: "break-all",
                        textWrap: "balance",
                      }}
                    >
                      Bienvenido
                    </Text>
                    <Text c={"dimmed"} lineClamp={2} size={"2xs"}>
                      Inicia sesión para realizar tus compras
                    </Text>
                  </>
                )}
              </Flex>
              {!userID && (
                <>
                  <Button
                    className="shadow-lg"
                    component={Link}
                    fullWidth
                    leftSection={<LogIn />}
                    mt={10}
                    size={"xs"}
                    to={PublicRoutes.LOGIN.route}
                  >
                    Iniciar sesión
                  </Button>
                  <Text c={"dimmed"} lineClamp={2} size={"2xs"}>
                    ¿No tienes cuenta?{" "}
                    <Text
                      component={Link}
                      span
                      to={PublicRoutes.SIGNUP.route}
                      c={"primary"}
                      fw={700}
                    >
                      Registrate aqui
                    </Text>
                  </Text>
                </>
              )}
              {userID && (
                <>
                  <Button
                    color="danger"
                    fullWidth
                    leftSection={<LogOut />}
                    onClick={() => {
                      modalLogoutActions.open();
                    }}
                    variant="light"
                  >
                    Salir
                  </Button>
                </>
              )}
            </Flex>
          </HoverCard.Dropdown>
        </HoverCard>
      </Flex>
    </Flex>
  );
};

export const Navbar = memo(() => {
  return (
    <Paper
      bg={"navbar"}
      c={"for-navbar"}
      h={{ base: 80, md: 70 }}
      radius={0}
      style={{ overflowX: "hidden" }}
      shadow={"sm"}
    >
      <Flex align={"center"} h={"100%"} w={"100%"}>
        <ContainerSection maw={"100%"} px={{ base: 10, md: 20 }}>
          <Flex align={"center"} gap={5} h={"100%"} justify={"space-between"}>
            <Flex align={"center"} className="grow" gap={5}>
              <NavbarLogo />
            </Flex>
            <Flex
              align={"center"}
              className="grow"
              justify={"flex-end"}
              gap={5}
            >
              <NavbarButtons />
            </Flex>
          </Flex>
        </ContainerSection>
      </Flex>
    </Paper>
  );
});
