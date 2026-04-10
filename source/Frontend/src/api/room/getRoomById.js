import { apiClient } from "../axiosClient";

export async function getRoomsById(id) {
    try {
        const { data } = await apiClient.get(`/rooms/${id}`);
        return data;
    } 
    catch (error) {
        console.error(error.message);
    }
}