import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";

import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

	// Add response interceptor to handle 401 and refresh token
	useEffect(() => {
		const interceptor = axiosInstance.interceptors.response.use(
			(response: any) => response,
			async (error: any) => {

				if (error.response?.status === 401 && !error.config._retry) {
					try {
						const newToken = await getToken();
						if (newToken) {
							updateApiToken(newToken);
							error.config.headers.Authorization = `Bearer ${newToken}`;
							error.config._retry = true;
							return axiosInstance(error.config);
						}
					} catch (refreshError) {
						console.log("Token refresh failed", refreshError);
						// Optionally, sign out the user or handle logout
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.response.eject(interceptor);
		};
	}, [getToken]);

	if (loading)
		return (
			<div className='flex items-center justify-center w-full h-screen'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
