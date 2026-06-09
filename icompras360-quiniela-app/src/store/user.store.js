import { create } from "zustand";
import { persist } from "zustand/middleware";

const inicialState = {
  id: null,
  email: null,
  token: null,
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
    reset: () => {
      set(inicialState);
    },
  })),
);
