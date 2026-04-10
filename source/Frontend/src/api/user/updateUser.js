import { apiClient } from "../axiosClient";

export async function updateUser(id, updated) {
    try {
        const { data: updatedUser } = await apiClient.put(`/users/${id}`, updated);
        return updatedUser;
    }
    catch (err) {
        console.error(err.message);
    }
}
