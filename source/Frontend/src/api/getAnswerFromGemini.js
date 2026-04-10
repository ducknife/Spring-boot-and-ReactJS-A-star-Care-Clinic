import { geminiClient } from "./axiosClient";

export async function getAnswerFromGemini(prompt) {
    try {
        const response = await geminiClient.post("/ask", { question: prompt });
        console.log("Response status:", response.status);
        const data = response.data;
        console.log("API Response:", data);
        return data;
    }
    catch (error) {
        const errorData = error.response?.data || {};
        console.error("API Error Response:", errorData);
        console.error(error);
    }
}

