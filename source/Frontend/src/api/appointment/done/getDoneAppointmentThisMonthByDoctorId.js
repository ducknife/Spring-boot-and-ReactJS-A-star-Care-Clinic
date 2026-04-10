import { apiClient } from "../../axiosClient";

export async function getDoneAppointmentThisMonthByDoctorId(id) {
    try {
        const { data } = await apiClient.get(`/appointments/month/done/${id}`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}