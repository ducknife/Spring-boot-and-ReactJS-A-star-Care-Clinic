import { apiClient } from "./axiosClient";

export async function loginApi({ email, password }) {
  try {
    const { data } = await apiClient.post("/auth/login", {
      username: email,
      password,
    });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Dang nhap that bai";
    throw new Error(errorMessage);
  }
}
