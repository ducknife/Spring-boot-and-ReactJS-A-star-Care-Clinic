import { apiClient } from "../axiosClient";

export async function getUsers() {
    try {
        const { data } = await apiClient.get('/users');
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}