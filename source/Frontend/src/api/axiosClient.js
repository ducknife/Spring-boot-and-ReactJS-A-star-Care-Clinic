import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export const geminiClient = axios.create({
    baseURL: "http://localhost:8005",
    headers: {
        "Content-Type": "application/json"
    }
});