import { apiClient } from "../../axiosClient";

export async function getTodayPendingAppointments() {
    try {
        const { data } = await apiClient.get('/appointments/today/pending');
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}