// MANTINE
import { Flex, UnstyledButton, useMantineColorScheme } from "@mantine/core";
// LUCIDE
import { Moon, Sun } from "lucide-react";
// STYLES
import classes from "@styles/global.module.css";

export const ThemeButton = () => {
  // THEME
  const { setColorScheme } = useMantineColorScheme();
  return (
    <>
      <UnstyledButton
        aria-label="Cambiar a modo oscuro"
        c={"for-navbar"}
        className={classes.navbarButton}
        darkHidden
        h={45}
        onClick={() => setColorScheme("dark")}
        w={45}
      >
        <Flex align={"center"} justify={"center"}>
          <Sun />
        </Flex>
      </UnstyledButton>
      <UnstyledButton
        aria-label="Cambiar a modo claro"
        c={"for-navbar"}
        className={classes.navbarButton}
        lightHidden
        h={45}
        onClick={() => setColorScheme("light")}
        w={45}
      >
        <Flex align={"center"} justify={"center"}>
          <Moon />
        </Flex>
      </UnstyledButton>
    </>
  );
};
