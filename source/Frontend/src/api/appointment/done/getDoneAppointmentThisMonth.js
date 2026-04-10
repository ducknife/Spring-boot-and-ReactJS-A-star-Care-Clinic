import { apiClient } from "../../axiosClient";

export async function getDoneAppointmentThisMonth() {
    try {
        const { data } = await apiClient.get('/appointments/month/done');
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}