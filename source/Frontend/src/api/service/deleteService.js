import { apiClient } from "../axiosClient";

export async function deleteServiceById(id) {
    try {
        const { data } = await apiClient.delete(`/services/${id}`);
        return data;
    }
    catch (error) {
        console.error("Failed to fetch API", error.message);
    }
}