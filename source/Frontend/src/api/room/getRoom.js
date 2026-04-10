import { apiClient } from "../axiosClient";

export async function getRooms() {
    try {
        const { data } = await apiClient.get('/rooms');
        return data;
    } 
    catch (error) {
        console.error(error.message);
    }
}