import { apiClient } from "../axiosClient";

export async function deleteRoom(id) {
    try {
        const { data } = await apiClient.delete(`/rooms/${id}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}