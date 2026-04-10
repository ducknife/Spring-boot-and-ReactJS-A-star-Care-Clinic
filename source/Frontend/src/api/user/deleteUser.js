import { apiClient } from "../axiosClient";

export async function deleteUserById(id) {
    try {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}