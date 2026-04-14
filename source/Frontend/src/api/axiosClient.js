import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const geminiClient = axios.create({
    baseURL: "http://localhost:8005",
    headers: {
        "Content-Type": "application/json"
    }
});

const extractErrorMessage = (error) => {
    const payload = error?.response?.data;

    if (typeof payload === "string" && payload.trim()) {
        return payload;
    }

    if (payload?.message) {
        return payload.message;
    }

    if (payload?.error) {
        return payload.error;
    }

    if (error?.message) {
        return error.message;
    }

    return "Yeu cau that bai";
};

apiClient.interceptors.request.use((config) => {
    const skipAuth = config?.headers?.["X-Skip-Auth"] === "true";
    if (skipAuth) {
        if (config.headers) {
            delete config.headers.Authorization;
            delete config.headers["X-Skip-Auth"];
        }
        return config;
    }

    // Auth now relies on HttpOnly cookies set by backend.
    if (config.headers) {
        delete config.headers.Authorization;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(new Error(extractErrorMessage(error)))
);