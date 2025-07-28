import axios from 'axios';
import useAuthStore from '../stores/useAuth';
import userStore from '../stores/useAuthUser';

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

const refreshToken = async () => {
	try {
		const response = await api.post('/api/refresh-token');
		const newAccessToken = response.data.accessToken;
		return newAccessToken;
	} catch (err) {
		console.error('Failed to refresh token');
		// logout logic
		userStore.setState({ user: null });
	}
};

authApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response.status === 401) {
			const newAccessToken = await refreshToken();
			// set new access token in zustand store
			useAuthStore.setState({ accessToken: newAccessToken });

			if (newAccessToken) {
				authApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
				return authApi.request(error.config);
			}
		}
		return Promise.reject(error);
	}
);
