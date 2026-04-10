import { apiClient } from "../axiosClient";

export async function getRecentActivities() {
    try {
        const { data } = await apiClient.get('/activities/recent');
        return data;
    }
    catch (error) {
        console.log(error);
    }
}