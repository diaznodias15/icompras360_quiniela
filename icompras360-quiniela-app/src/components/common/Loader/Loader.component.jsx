// MANTINE
import {
  AspectRatio,
  Flex,
  Image,
  Loader as LoaderMantine,
  LoadingOverlay,
} from "@mantine/core";

export const LoaderSpinner = () => {
  return (
    <Flex align={"center"} direction={"column"} gap={5}>
      <AspectRatio mah={70} ratio={16 / 9}>
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          fit="contain"
          darkHidden
          h={"100%"}
          src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
        />
        <Image
          alt={`Logo de ${import.meta.env.VITE_APP_NAME}`}
          fit="contain"
          lightHidden
          h={"100%"}
          src={`${import.meta.env.BASE_URL}img/logo-dark.webp`}
        />
      </AspectRatio>
      <LoaderMantine h={"auto"} size={"xl"} type="dots" />
    </Flex>
  );
};

export const Loader = (props) => {
  return (
    <LoadingOverlay
      h={"100vh"}
      left={0}
      loaderProps={{
        children: (
          <Flex
            align={"center"}
            h={"100vh"}
            justify={"center"}
            p={20}
            w={"100%"}
          >
            <Flex
              align={"center"}
              direction={"column"}
              gap={10}
              h={"100%"}
              justify={"center"}
              maw={300}
            >
              <LoaderSpinner />
            </Flex>
          </Flex>
        ),
      }}
      pos={"fixed"}
      overlayProps={{ blur: 100, bg: "background" }}
      size={"xl"}
      top={0}
      transitionProps={{ transition: "fade", duration: 0 }}
      visible={true}
      w={"100%"}
      zIndex={1000}
      {...props}
    />
  );
};
