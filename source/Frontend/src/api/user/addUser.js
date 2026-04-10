import { apiClient } from "../axiosClient";

export async function addUser(user) {
    try {
        const { data } = await apiClient.post("/users/register", user);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}