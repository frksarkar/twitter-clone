import axios from 'axios';
import useAuthStore from '../stores/useAuth';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,

	withCredentials: true,
});

export const authApi = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true, // Ensure cookies are sent with the request
});

useAuthStore.subscribe(({ accessToken }) => {
	authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
});
