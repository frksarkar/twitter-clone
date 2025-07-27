import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useAuthStore from '../stores/useAuth';
import { User } from '../types/tweet';
import userStore from '../stores/useAuthUser';
import { api, authApi } from '../api';

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
	logout: () => void;
	updateProfile: (profileData: Partial<User>) => void;
	isLoading: boolean;
	token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const { setToken, accessToken } = useAuthStore();

	const { user, setUser } = userStore();

	useEffect(() => {
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setIsLoading(true);

			const loginResponse = await api.post<{ token: string; message: string }>('/login', {
				email,
				password,
			});

			if (!loginResponse.data.token) throw new Error('Authentication failed');

			setToken(loginResponse.data.token);

			const userResponse = await authApi.get<{ status: string; data: User }>('/profile');

			if (userResponse.data.status !== 'success') {
				throw new Error('Failed to fetch user data');
			}

			const { data: user } = userResponse.data;
			setUser(user);
			return true;
		} catch (error) {
			console.error('Login error:', error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
		try {
			setIsLoading(true);

			const existingUser = await api.post(`/register`, {
				name,
				username,
				email,
				password,
			});

			setIsLoading(false);
			setUser(existingUser.data.data);
			return true;
		} catch (error) {
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfile = (profileData: Partial<User>) => {
		if (user) {
			const updatedUser = { ...user, ...profileData };
			setUser(updatedUser);
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
	};

	return <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading, token: accessToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
