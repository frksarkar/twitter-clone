import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
	accessToken: string | null;
	setToken: (token: string | null) => void;
	getToken: () => string | null;
}

const useAuthStore = create<AuthStore>((set, get) => ({
	accessToken: null,
	setToken: (token) => set({ accessToken: token }),
	getToken: () => get().accessToken,
}));
export default useAuthStore;
