import { apiClient } from "../axiosClient";

export async function searchServices(searchParams = {}) {
    try {
        const params = new URLSearchParams();
        
        if (searchParams.name) params.append('name', searchParams.name);
        if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
        if (searchParams.active !== undefined && searchParams.active !== '') {
            params.append('active', searchParams.active);
        }

        const { data } = await apiClient.get(`/services/search${params.toString() ? '?' + params.toString() : ''}`);
        return data;
    }
    catch (error) {
        console.log(error.message);
    }
}
