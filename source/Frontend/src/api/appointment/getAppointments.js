import { apiClient } from "../axiosClient";

export async function getAppointments() {
    try {
        const { data } = await apiClient.get(`/appointments`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}