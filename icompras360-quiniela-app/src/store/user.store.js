import { create } from "zustand";
import { persist } from "zustand/middleware";

const inicialState = {
  id: null,
  email: null,
  token: null,
  is_cli: null,
};
export const useUserStore = create(
  persist((set) => ({
    ...inicialState,
    setId: (id) => {
      set(() => ({ id }));
    },
    setEmail: (email) => {
      set(() => ({ email }));
    },
    setToken: (token) => {
      set(() => ({ token }));
    },
    setIsCli: (is_cli) => {
      set(() => ({ is_cli }));
    },
    reset: () => {
      set(inicialState);
    },
  })),
);
