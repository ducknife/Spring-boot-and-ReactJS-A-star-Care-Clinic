import { apiClient } from "../axiosClient";

export async function addRoom(newRoom) {
    try {
        const { data } = await apiClient.post('/rooms', newRoom);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}