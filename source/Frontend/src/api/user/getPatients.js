import { apiClient } from "../axiosClient";

export async function getPatients() {
    try {
        const { data } = await apiClient.get("/users/patient");
        return data;
    }
    catch (error) {
        console.error(error);
    }
}