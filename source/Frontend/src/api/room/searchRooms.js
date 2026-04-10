import { apiClient } from "../axiosClient";

export async function searchRooms(searchParams = {}) {
    try {
        const params = new URLSearchParams();

        if (searchParams.floor) {
            params.append('floor', searchParams.floor);
        }

        const { data } = await apiClient.get(`/rooms/search${params.toString() ? `?${params.toString()}` : ''}`);
        return data;
    }
    catch (error) {
        throw new Error('Failed to search rooms');
    }
}
