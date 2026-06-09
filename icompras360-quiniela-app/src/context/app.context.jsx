import { createContext, useMemo, useState } from "react";
// MANTINE
import { useDisclosure } from "@mantine/hooks";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  // STATES
  const [appConfig, setAppConfig] = useState({});

  // MANTINE HOOKS
  const [isModalLogoutOpened, modalLogoutActions] = useDisclosure(false);

  // MEMO

  const contextValue = useMemo(() => {
    return {
      appConfig: appConfig,
      setAppConfig: setAppConfig,
      isModalLogoutOpened: isModalLogoutOpened,
      modalLogoutActions: modalLogoutActions,
    };
  }, [appConfig, isModalLogoutOpened]);

  return <AppContext value={contextValue}>{children}</AppContext>;
};
