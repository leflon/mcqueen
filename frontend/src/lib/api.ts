const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

/**
 * Make an API call to the backend
 * @param endpoint - The API endpoint (without base URL, e.g., '/auth/login')
 * @param method - HTTP method (defaults to 'GET')
 * @param body - Request body (optional)
 * @returns The response data
 */
export async function api(
	endpoint: string,
	method: HttpMethod = 'GET',
	body?: Record<string, any> | Array<any>
) {
	const config: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Always send cookies
	};

	if (body && method !== 'GET') {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
	return response.json();
}