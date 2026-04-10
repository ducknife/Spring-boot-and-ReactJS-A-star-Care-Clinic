import { apiClient } from "../../axiosClient";

export async function getPendingAppointmentByPatientId(id) {
    try {
        const { data } = await apiClient.get(`/appointments/pending/patient/${id}`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}