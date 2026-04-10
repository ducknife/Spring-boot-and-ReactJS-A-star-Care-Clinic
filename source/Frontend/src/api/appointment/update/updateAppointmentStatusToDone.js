import { apiClient } from "../../axiosClient";

export async function updateAppointmentStatusToDone(id) {
    try {
        await apiClient.patch(`/appointments/done/${id}`);
    }
    catch (error) {
        console.error(error.message);
    }
}