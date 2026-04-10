import { apiClient } from "../axiosClient";

export async function getUserById(id) {
    try {
        const { data: userData } = await apiClient.get(`/users/${id}`);
        return userData;
    }
    catch (error) {
        console.error(error.message);
    }
}