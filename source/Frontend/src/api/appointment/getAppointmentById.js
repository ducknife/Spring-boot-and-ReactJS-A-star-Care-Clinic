import { apiClient } from "../axiosClient";

export async function getAppointmentById(id) {
    try {
        const { data } = await apiClient.get(`/appointments/${id}`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}