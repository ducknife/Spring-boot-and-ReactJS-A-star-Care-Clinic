import { httpDelete, httpGet, httpGetPublic, httpPost, httpPut, toQueryString } from "./http";

export const userService = {
    async getAll() {
        return httpGet("/users");
    },
    async getById(id) {
        return httpGet(`/users/${id}`);
    },
    async getDoctors(params = {}) {
        return httpGetPublic(`/users/doctor${toQueryString(params)}`);
    },
    async getPatients() {
        return httpGet(`/users${toQueryString({ role: "PATIENT" })}`);
    },
    async search(searchParams = {}) {
        return httpGet(`/users${toQueryString(searchParams)}`);
    },
    async create(user) {
        return httpPost("/users", user);
    },
    async update(id, updated) {
        return httpPut(`/users/${id}`, updated);
    },
    async getDoctorProfile(id) {
        return httpGet(`/users/${id}/doctor-profile`);
    },
    async updateDoctorProfile(id, payload) {
        return httpPut(`/users/${id}/doctor-profile`, payload);
    },
    async remove(id) {
        return httpDelete(`/users/${id}`);
    },
};
