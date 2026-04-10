import { apiClient } from "../axiosClient";

export async function addService(service) {
    try {
        const { data } = await apiClient.post("/services", service);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}