import { apiClient } from "../../axiosClient";

export async function deleteAppointment(id) {
    try {
        await apiClient.delete(`/appointments/${id}`);
        
    }
    catch (error) {
        console.error(error.message);
    }
}