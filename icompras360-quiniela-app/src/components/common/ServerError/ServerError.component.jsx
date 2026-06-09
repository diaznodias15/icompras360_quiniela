// REACT
import { Link } from "react-router";
// MANTINE
import { Anchor, Flex, Image, Title, Text, useMatches } from "@mantine/core";
// LUCIDE
import { House } from "lucide-react";
// ROUTER
import { PublicRoutes } from "@router/routes.router";
// STYLES
import classes from "@styles/global.module.css";

export const ServerError = ({
  bg = "background",
  code = 500,
  mih = "100vh",
  pt = 100,
  subtle = "Por favor, contacte con el administrador",
  title = "Ocurrió un problema",
  isShowBackButton = false,
}) => {
  return (
    <Flex
      align={"center"}
      direction={"column"}
      bg={bg}
      justify={"flex-start"}
      mih={mih}
      pt={pt}
      px={20}
      w={"100%"}
    >
      <Flex align="center" justify="center">
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          darkHidden
          fit={"contain"}
          h={100}
          src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
          w={useMatches({ base: 130, xs: 170, md: 200 })}
        />
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          lightHidden
          fit={"contain"}
          h={100}
          src={`${import.meta.env.BASE_URL}img/logo-dark.webp`}
          w={useMatches({ base: 130, xs: 170, md: 200 })}
        />
      </Flex>
      <Title c={"primary"} size={150}>
        {code}
      </Title>
      <Title size={useMatches({ base: 40, md: 60 })}>{title}</Title>
      <Title size={useMatches({ base: 20, md: 40 })}>{subtle}</Title>
      {isShowBackButton && (
        <Anchor
          className={classes.navbarItem}
          component={Link}
          mt={10}
          to={PublicRoutes.HOME.route}
          size="xl"
          underline="never"
        >
          <Flex align={"center"} gap={5}>
            <House />
            <Text>Volver al inicio</Text>
          </Flex>
        </Anchor>
      )}
    </Flex>
  );
};
