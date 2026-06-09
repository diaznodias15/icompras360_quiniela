// REACT
import { createContext, useMemo } from "react";
// MANTINE
import { createFormContext, useForm } from "@mantine/form";

export const [UserFormProvider, useUserFormContext, useUserForm] =
  createFormContext();

export const LoginContext = createContext(null);
