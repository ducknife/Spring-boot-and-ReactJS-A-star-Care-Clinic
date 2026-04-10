import { apiClient, geminiClient } from "../axiosClient";

export const authService = {
    async login({ email, password }) {
        const { data } = await apiClient.post("/auth/login", {
            username: email,
            password,
        });
        return data;
    },
};

export const geminiService = {
    async ask(prompt) {
        const { data } = await geminiClient.post("/ask", { question: prompt });
        return data;
    },
};

export const activityService = {
    async getRecent() {
        const { data } = await apiClient.get("/activities/recent");
        return data;
    },
};

export const roomService = {
    async getAll() {
        const { data } = await apiClient.get("/rooms");
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/rooms/${id}`);
        return data;
    },
    async search(searchParams = {}) {
        const params = new URLSearchParams();
        if (searchParams.floor) params.append("floor", searchParams.floor);
        const { data } = await apiClient.get(`/rooms/search${params.toString() ? `?${params.toString()}` : ""}`);
        return data;
    },
    async create(newRoom) {
        const { data } = await apiClient.post("/rooms", newRoom);
        return data;
    },
    async update(id, update) {
        const { data } = await apiClient.put(`/rooms/${id}`, update);
        return data;
    },
    async remove(id) {
        const { data } = await apiClient.delete(`/rooms/${id}`);
        return data;
    },
};

export const serviceService = {
    async getAll() {
        const { data } = await apiClient.get("/services");
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/services/${id}`);
        return data;
    },
    async getByName(name) {
        const { data } = await apiClient.get(`/services/search?name=${name}`);
        return data;
    },
    async search(searchParams = {}) {
        const params = new URLSearchParams();
        if (searchParams.name) params.append("name", searchParams.name);
        if (searchParams.minPrice) params.append("minPrice", searchParams.minPrice);
        if (searchParams.maxPrice) params.append("maxPrice", searchParams.maxPrice);
        if (searchParams.active !== undefined && searchParams.active !== "") {
            params.append("active", searchParams.active);
        }
        const { data } = await apiClient.get(`/services/search${params.toString() ? `?${params.toString()}` : ""}`);
        return data;
    },
    async create(service) {
        const { data } = await apiClient.post("/services", service);
        return data;
    },
    async update(id, update) {
        await apiClient.put(`/services/${id}`, update);
    },
    async remove(id) {
        const { data } = await apiClient.delete(`/services/${id}`);
        return data;
    },
};

export const userService = {
    async getAll() {
        const { data } = await apiClient.get("/users");
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/users/${id}`);
        return data;
    },
    async getDoctors() {
        const { data } = await apiClient.get("/users/doctor");
        return data;
    },
    async getPatients() {
        const { data } = await apiClient.get("/users/patient");
        return data;
    },
    async search(searchParams = {}) {
        const params = new URLSearchParams();
        if (searchParams.fullName) params.append("fullName", searchParams.fullName);
        if (searchParams.role) params.append("role", searchParams.role);
        if (searchParams.email) params.append("email", searchParams.email);
        const { data } = await apiClient.get(`/users/search${params.toString() ? `?${params.toString()}` : ""}`);
        return data;
    },
    async create(user) {
        const { data } = await apiClient.post("/users/register", user);
        return data;
    },
    async update(id, updated) {
        const { data } = await apiClient.put(`/users/${id}`, updated);
        return data;
    },
    async remove(id) {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
    },
};

export const appointmentService = {
    async getAll() {
        const { data } = await apiClient.get("/appointments");
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/appointments/${id}`);
        return data;
    },
    async getByDoctorId(id) {
        const { data } = await apiClient.get(`/appointments/doctor/${id}`);
        return data;
    },
    async getToday() {
        const { data } = await apiClient.get("/appointments/today");
        return data;
    },
    async filter(filters = {}) {
        const params = new URLSearchParams();
        if (filters.doctorName) params.append("doctorName", filters.doctorName);
        if (filters.patientName) params.append("patientName", filters.patientName);
        if (filters.appointmentDate) params.append("appointmentDate", filters.appointmentDate);
        if (filters.status) params.append("status", filters.status);
        if (filters.roomName) params.append("roomName", filters.roomName);
        const { data } = await apiClient.get(`/appointments/filter${params.toString() ? `?${params.toString()}` : ""}`);
        return data;
    },
    async create(appointment) {
        const { data } = await apiClient.post("/appointments/book", appointment);
        return data;
    },
    async update(id, updated) {
        const { data } = await apiClient.put(`/appointments/${id}`, updated);
        return data;
    },
    async remove(id) {
        await apiClient.delete(`/appointments/${id}`);
    },
    async markDone(id) {
        await apiClient.patch(`/appointments/done/${id}`);
    },
    async markCancelled(id) {
        await apiClient.patch(`/appointments/cancel/${id}`);
    },
    async pendingToday() {
        const { data } = await apiClient.get("/appointments/today/pending");
        return data;
    },
    async pendingByDoctorId(id) {
        const { data } = await apiClient.get(`/appointments/pending/doctor/${id}`);
        return data;
    },
    async pendingByPatientId(id) {
        const { data } = await apiClient.get(`/appointments/pending/patient/${id}`);
        return data;
    },
    async doneThisMonth() {
        const { data } = await apiClient.get("/appointments/month/done");
        return data;
    },
    async doneThisMonthByDoctorId(id) {
        const { data } = await apiClient.get(`/appointments/month/done/${id}`);
        return data;
    },
    async notPendingByPatientId(id) {
        const { data } = await apiClient.get(`/appointments/not-pending/patient/${id}`);
        return data;
    },
};