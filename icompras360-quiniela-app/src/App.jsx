// MANTINE
import {
  createTheme,
  colorsTuple,
  DEFAULT_THEME,
  MantineProvider,
  rem,
  Text,
  v8CssVariablesResolver,
  virtualColor,
} from "@mantine/core";
// CONTEXT
import { AppContextProvider } from "@context/app.context";
// ROUTER
import AppRouter from "@router/AppRouter.router";
// STYLES
import "@mantine/core/styles.css";

function App() {
  const theme = createTheme({
    // COLORS
    primaryColor: "primary",
    defaultRadius: "lg",
    colors: {
      //C-B
      "c-background": colorsTuple("#F2F2F2"),
      "c-background-dark": colorsTuple("#1E293B"),
      // C-D
      "c-danger": colorsTuple("#F31260"),
      "c-danger-dark": colorsTuple("#F31260"),
      // C-N
      "c-navbar": colorsTuple("#FFFFFF"),
      "c-navbar-dark": colorsTuple("#242F3E"),
      // C-P
      "c-primary": [
        "#ecf4ff",
        "#dce4f5",
        "#b9c7e2",
        "#94a8d0",
        "#748dc0",
        "#5f7cb7",
        "#5474b4",
        "#44639f",
        "#3a5890",
        "#2c4b80",
      ],
      "c-primary-dark": [
        "#ecf4ff",
        "#dce4f5",
        "#b9c7e2",
        "#94a8d0",
        "#748dc0",
        "#5f7cb7",
        "#5474b4",
        "#44639f",
        "#3a5890",
        "#2c4b80",
      ],

      // C-S
      "c-section": colorsTuple("#FFFFFF"),
      "c-section-dark": colorsTuple("#242F3E"),
      "c-success": colorsTuple("#00973C"),
      "c-success-dark": colorsTuple("#00973C"),

      // B
      background: virtualColor({
        name: "background",
        dark: "c-background-dark",
        light: "c-background",
      }),

      // D
      danger: virtualColor({
        dark: "c-danger-dark",
        light: "c-danger",
        name: "danger",
      }),

      // N
      navbar: virtualColor({
        dark: "c-navbar-dark",
        light: "c-navbar",
        name: "navbar",
      }),

      // P
      primary: virtualColor({
        dark: "c-primary-dark",
        light: "c-primary",
        name: "primary",
      }),
      // S
      section: virtualColor({
        dark: "c-section-dark",
        light: "c-section",
        name: "section",
      }),
      success: virtualColor({
        name: "success",
        dark: "c-success-dark",
        light: "c-success",
      }),
    },
    // FONTS
    fontFamily: "Interface-Font, Monaco",
    fontFamilyMonospace: "Monaco, Courier, monospace",
    headings: {
      // Use default theme if you want to provide default Mantine fonts as a fallback
      fontFamily: `Interface-Font, ${DEFAULT_THEME.fontFamily}`,
    },
    fontSizes: {
      "2xs": rem(10),
      "2xl": rem(25),
      "3xl": rem(30),
      "4xl": rem(35),
    },
    breakpoints: {
      xs: "30em",
      sm: "48em",
      md: "64em",
      lg: "74em",
      xl: "90em",
      "2xl": "100em",
    },
    components: {
      Text: Text.extend({
        defaultProps: {
          // Si usas Mantine v7+, puedes pasar estilos inline por defecto
          styles: {
            root: {
              textWrap: "balance",
            },
          },
        },
      }),
      // Opcional: También podrías querer aplicarlo a los títulos
      Title: {
        defaultProps: {
          styles: {
            root: {
              textWrap: "balance",
            },
          },
        },
      },
    },
  });
  return (
    <MantineProvider
      classNamesPrefix="App"
      cssVariablesResolver={v8CssVariablesResolver}
      defaultColorScheme="light"
      theme={theme}
    >
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </MantineProvider>
  );
}

export default App;
