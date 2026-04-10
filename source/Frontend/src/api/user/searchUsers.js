import { apiClient } from "../axiosClient";

export async function searchUsers(searchParams = {}) {
    try {
        const params = new URLSearchParams();
        
        if (searchParams.fullName) params.append('fullName', searchParams.fullName);
        if (searchParams.role) params.append('role', searchParams.role);
        if (searchParams.email) params.append('email', searchParams.email);

        const { data } = await apiClient.get(`/users/search${params.toString() ? '?' + params.toString() : ''}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}
