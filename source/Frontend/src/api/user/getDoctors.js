import { apiClient } from "../axiosClient";

export async function getDoctors() {
    try {
        const { data } = await apiClient.get("/users/doctor");
        return data;
    }
    catch (error) {
        console.error(error);
    }
}