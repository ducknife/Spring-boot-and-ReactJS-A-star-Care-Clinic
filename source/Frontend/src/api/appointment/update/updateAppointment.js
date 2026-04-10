import { apiClient } from "../../axiosClient";

export async function updateAppointment(id, updated) {
    try {
        const { data } = await apiClient.put(`/appointments/${id}`, updated);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}