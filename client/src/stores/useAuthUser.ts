import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/tweet';

interface AuthUserStore {
	user: User | null;
	setUser: (user: User | null) => void;
	getUser: () => User | null;
}

const userStore = create<AuthUserStore>((set, get) => ({
	user: null,
	setUser: (user) => set({ user }),
	getUser: () => get().user,
}));

export default userStore;
