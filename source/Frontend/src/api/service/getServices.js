import { apiClient } from "../axiosClient";

export async function getServices() {
    try {
        const { data } = await apiClient.get("/services");
        return data;
    }
    catch (error) {
        console.error("Failed to fetch API", error.message);
    }
}