import { userService } from "../api";

const FALLBACK_SPECIALTY = "Đang cập nhật";

const normalizeDoctors = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export async function getDoctorsWithProfiles(limit) {
    const query = typeof limit === "number" ? { page: 0, size: limit } : { page: 0, size: 50 };
    const doctorPayload = await userService.getDoctors(query);
    const doctors = normalizeDoctors(doctorPayload);

    const scopedDoctors = typeof limit === "number" ? doctors.slice(0, limit) : doctors;

    return scopedDoctors.map((doctor) => {
        const specialty =
            doctor?.specialty
            || doctor?.doctorProfile?.specialty
            || doctor?.department
            || FALLBACK_SPECIALTY;

        const yearsExperience = toNumber(
            doctor?.yearsExperience ?? doctor?.doctorProfile?.yearsExperience,
            0,
        );

        return {
            ...doctor,
            specialty,
            yearsExperience,
            clinicLocation: doctor?.clinicLocation || doctor?.doctorProfile?.clinicLocation || "",
        };
    });
}
