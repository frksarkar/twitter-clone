import { useState, useEffect } from 'react';
import { authApi } from '../api';

interface Config {
	token: string;
	method: string;
	params?: any;
	headers?: any;
}

function useFetch(url: string, { token, method, params }: Config) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await authApi(url, {
					method,
					params,
					signal: controller.signal,
				});

				const result = response.data; // Extract the data from the response.

				setData(result);
			} catch (err: any) {
				if (err.name !== 'CanceledError') {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url, token]);

	return { data, loading, error };
}

export default useFetch;
