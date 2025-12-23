import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthChecked: false, 

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/signup", data);
      set({ user: response.data.user, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/login", data);
      set({ user: response.data.user, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }},

    logout: async () => {
      set({ isLoading: true });
      try {
        await api.post("/auth/logout");
        set({ user: null, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }},

     getProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/auth/profile");
      set({
        user: res.data.user,
        isLoading: false,
        isAuthChecked: true,
      });
    } catch (error) {
      set({
        user: null,
        isLoading: false,
        isAuthChecked: true, // ✅ even on 401
      });
    }
  },
}));
