import { httpDelete, httpGet, httpPatch, httpPost, httpPut, toQueryString } from "./http";

export const APPOINTMENT_CHANGED_EVENT = "appointment-changed";

const emitAppointmentChanged = (detail = {}) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(APPOINTMENT_CHANGED_EVENT, {
            detail: {
                at: Date.now(),
                ...detail,
            },
        }));
    }
};

export const appointmentService = {
    async getAll() {
        return httpGet("/appointments");
    },
    async getById(id) {
        return httpGet(`/appointments/${id}`);
    },
    async getByDoctorId(id) {
        return httpGet(`/appointments${toQueryString({ doctorId: id })}`);
    },
    async getToday() {
        return httpGet(`/appointments${toQueryString({ today: true })}`);
    },
    async filter(filters = {}) {
        return httpGet(`/appointments${toQueryString(filters)}`);
    },
    async getAvailability(serviceId, date) {
        return httpGet(`/appointments/availability${toQueryString({ serviceId, date })}`);
    },
    async getDoctorAvailability(doctorId, serviceId, date, appointmentId) {
        return httpGet(`/appointments/doctor-availability${toQueryString({ doctorId, serviceId, date, appointmentId })}`);
    },
    async getDoctorsByService(serviceId) {
        return httpGet(`/appointments/doctors-by-service${toQueryString({ serviceId })}`);
    },
    async create(appointment) {
        const response = await httpPost("/appointments", appointment);
        emitAppointmentChanged({ action: "create" });
        return response;
    },
    async bookForPatient(appointment) {
        const response = await httpPost("/appointments", appointment);
        emitAppointmentChanged({ action: "book" });
        return response;
    },
    async update(id, updated) {
        const response = await httpPut(`/appointments/${id}`, updated);
        emitAppointmentChanged({ action: "update", appointmentId: id });
        return response;
    },
    async remove(id, cancelledBy = "PATIENT", cancelReason = "") {
        const response = await httpDelete(`/appointments/${id}${toQueryString({ cancelledBy, cancelReason })}`);
        emitAppointmentChanged({ action: "remove", appointmentId: id, cancelledBy });
        return response;
    },
    async markDone(id) {
        const response = await httpPatch(`/appointments/${id}/status${toQueryString({ status: "DONE" })}`);
        emitAppointmentChanged({ action: "done", appointmentId: id });
        return response;
    },
    async markCancelled(id) {
        const response = await httpPatch(`/appointments/${id}/status${toQueryString({ status: "CANCELLED" })}`);
        emitAppointmentChanged({ action: "cancel", appointmentId: id });
        return response;
    },
    async pendingToday() {
        return httpGet(`/appointments${toQueryString({ today: true, pending: true })}`);
    },
    async pendingByDoctorId(id) {
        return httpGet(`/appointments${toQueryString({ doctorId: id, pending: true })}`);
    },
    async pendingByDoctorIdPaged(id, params = {}) {
        return httpGet(`/appointments/pending/doctor/${id}/page${toQueryString(params)}`);
    },
    async pendingByPatientId(id) {
        return httpGet(`/appointments${toQueryString({ patientId: id, pending: true })}`);
    },
    async pendingByPatientIdPaged(id, params = {}) {
        return httpGet(`/appointments/pending/patient/${id}/page${toQueryString(params)}`);
    },
    async doneThisMonth() {
        return httpGet(`/appointments${toQueryString({ doneThisMonth: true })}`);
    },
    async doneThisMonthByDoctorId(id) {
        return httpGet(`/appointments${toQueryString({ doneThisMonth: true, doctorId: id })}`);
    },
    async notPendingByPatientId(id) {
        return httpGet(`/appointments${toQueryString({ patientId: id, pending: false })}`);
    },
    async historyByPatientId(id, params = {}) {
        return httpGet(`/appointments/history/patient/${id}${toQueryString(params)}`);
    },
    async getDoctorDashboard(filters = {}) {
        return httpGet(`/doctor/statistics/dashboard${toQueryString(filters)}`);
    },
    async getDoctorPatientAppointments(patientId, filters = {}) {
        return httpGet(`/doctor/statistics/patients/${patientId}/appointments${toQueryString(filters)}`);
    },
};
