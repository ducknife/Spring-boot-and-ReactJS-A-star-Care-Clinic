import { apiClient } from "../axiosClient";

export const toQueryString = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
            query.append(key, value);
        }
    });
    const resolved = query.toString();
    return resolved ? `?${resolved}` : "";
};

export const httpGet = async (url) => {
    const { data } = await apiClient.get(url);
    return data;
};

export const httpGetPublic = async (url) => {
    const { data } = await apiClient.get(url, {
        headers: { "X-Skip-Auth": "true" },
        withCredentials: false,
    });
    return data;
};

export const httpPost = async (url, payload) => {
    const { data } = await apiClient.post(url, payload);
    return data;
};

export const httpPut = async (url, payload) => {
    const { data } = await apiClient.put(url, payload);
    return data;
};

export const httpPatch = async (url, payload) => {
    const { data } = await apiClient.patch(url, payload);
    return data;
};

export const httpDelete = async (url) => {
    const { data } = await apiClient.delete(url);
    return data;
};