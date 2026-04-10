import { apiClient } from "../axiosClient";

export async function updateRoom(id, update) {
    try {
        const { data } = await apiClient.put(`/rooms/${id}`, update);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}