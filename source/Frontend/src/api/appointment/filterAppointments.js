import { apiClient } from "../axiosClient";

export async function filterAppointments(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        if (filters.doctorName) params.append('doctorName', filters.doctorName);
        if (filters.patientName) params.append('patientName', filters.patientName);
        if (filters.appointmentDate) params.append('appointmentDate', filters.appointmentDate);
        if (filters.status) params.append('status', filters.status);
        if (filters.roomName) params.append('roomName', filters.roomName);

        const { data } = await apiClient.get(`/appointments/filter${params.toString() ? '?' + params.toString() : ''}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}
