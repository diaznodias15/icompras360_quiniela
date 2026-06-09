import { create } from "zustand";
import { persist } from "zustand/middleware";

const inicialState = {
  id: null,
  email: null,
  name: null,
  phone: null,
  token: null,
  created_at: null,
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
    setName: (name) => {
      set(() => ({ name }));
    },
    setPhone: (phone) => {
      set(() => ({ phone }));
    },
    setToken: (token) => {
      set(() => ({ token }));
    },
    setCreatedAt: (created_at) => {
      set(() => ({ created_at }));
    },
    reset: () => {
      set(inicialState);
    },
  }))
);
