// ADAPTERS
import {
  advertisingsAdapter,
  appConfigAdapter,
  branchesAdapter,
  brandsAdapter,
  configColorsAdapter,
  departmentsAdapter,
} from "../adapters/config.adapter";
// SERVICES
import { handleGetUser } from "@services/auth/me.services";
// UTILITIES
import { axiosRequest } from "@utilities/axiosRequest";

export const loadConfig = async (defaultTheme, states, storeData) => {
  try {
    const {
      setAdvertisings,
      setAppConfig,
      setBranches,
      setBrands,
      setConfig,
      setDepartments,
      setIsError,
      setIsLoading,
      setIsMaintenance,
      setSelectedBranch,
    } = states;
    let configColorsAdapted = {};
    await axiosRequest({
      url: `/api/config/get`,
      method: "GET",
      onSuccess: async (response) => {
        // FORMATTING DATA
        configColorsAdapted = configColorsAdapter(response);
        const advertisingsAdapted = advertisingsAdapter(response);
        const brandsAdapted = brandsAdapter(response);
        const departmentsAdapted = departmentsAdapter(response);
        const branchesAdapted = branchesAdapter(response);
        const appConfigAdapted = appConfigAdapter(response);
        if (branchesAdapted.length == 0) {
          setIsError(true);
          return;
        }
        // SET STATES
        setConfig({ ...configColorsAdapted, ...defaultTheme });
        setAppConfig(appConfigAdapted);
        setAdvertisings(advertisingsAdapted);
        setBrands(brandsAdapted);
        setBranches(branchesAdapted);
        setDepartments(departmentsAdapted);

        // GET USER LOGGED
        await handleGetUser(storeData);

        setSelectedBranch(branchesAdapted[0].items[0]);
        setIsLoading(false);
      },
      onError: (code, error) => {
        console.error("Error al cargar configuración de la App: ", error);
        if (code == 503) {
          setIsMaintenance(true);
        } else {
          setIsError(true);
        }
        setIsLoading(false);
      },
    });
  } catch (error) {
    console.error("Error en loadConfig: ", error);
  }
};
