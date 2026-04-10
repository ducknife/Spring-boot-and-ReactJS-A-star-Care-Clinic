import { apiClient } from "../axiosClient";

export async function addAppointment(appointment) {
    try {
        const { data } = await apiClient.post("/appointments/book", appointment);
        return data;
    }
    catch (err) {
        console.error(err.message);
    }
}
