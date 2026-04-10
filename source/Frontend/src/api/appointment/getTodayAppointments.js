import { apiClient } from "../axiosClient";

export async function getTodayAppointments() {
    try {
        const { data } = await apiClient.get('/appointments/today');
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}