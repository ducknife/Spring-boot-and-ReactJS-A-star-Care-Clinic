import { apiClient } from "../axiosClient";

export async function updateService(id, update) {
    try {
        await apiClient.put(`/services/${id}`, update);
    }
    catch (error) {
        console.log(error.message);
    }
}