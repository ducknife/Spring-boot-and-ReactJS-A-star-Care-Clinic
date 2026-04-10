import { apiClient } from "../../axiosClient";

export async function updateAppointmentStatusToCancelled(id) {
    try {
        await apiClient.patch(`/appointments/cancel/${id}`);
    }
    catch (error) {
        console.error(error.message);
    }
}