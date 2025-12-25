import {create} from "zustand";
import api from "../lib/api";

export const useUserStore = create((set) => ({
    users: [],
    isLoading: false, 
    isDataFetched: false,
    
    fetchUsers: async () => {
        set({isLoading: true});
        try {
            const response = await api.get("/users");
            set({users: response.data, isLoading: false, isDataFetched: true});
        } catch (error) {
            console.error("Error fetching users:", error);
            set({isLoading: false, isDataFetched: false});   
        }
    },
}));