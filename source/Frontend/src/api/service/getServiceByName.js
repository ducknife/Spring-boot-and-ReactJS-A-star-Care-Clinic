import { apiClient } from "../axiosClient";

export async function getserviceByName(name) {
    try {
        const { data } = await apiClient.get(`/services/search?name=${name}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}