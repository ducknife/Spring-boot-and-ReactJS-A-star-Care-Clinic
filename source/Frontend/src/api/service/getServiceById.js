import { apiClient } from "../axiosClient";

export async function getServiceById(id) {
    try {
        const { data } = await apiClient.get(`/services/${id}`);
        return data;
    }
    catch (error) {
        console.error("Failed to fetch API", error.message);
    }
}