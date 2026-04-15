import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../../components/DoctorCard";
import { getDoctorsWithProfiles } from "../../utils/doctorCatalog";

export default function SpecialistsSection() {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const loadDoctors = async () => {
            try {
                const data = await getDoctorsWithProfiles(10);
                if (!active) return;
                setDoctors(data);
            } catch {
                if (!active) return;
                setDoctors([]);
            }
        };

        loadDoctors();
        return () => {
            active = false;
        };
    }, []);

    if (doctors.length === 0) return null;

    return (
        <section className="bg-white py-16 px-6 md:px-14 xl:px-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-[var(--brand-navy)] md:text-4xl">
                        Chuyên gia hàng đầu
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        10 bác sĩ đầu tiên đang công tác tại A*Care, hiển thị chuyên môn và số năm kinh nghiệm để bạn dễ lựa chọn.
                    </p>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
                    {doctors.map((doctor, idx) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="min-w-[260px] snap-start md:min-w-0"
                        >
                            <DoctorCard doctor={doctor} />
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate("/doctors")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--brand-700)]"
                    >
                        Xem danh sách bác sĩ
                        <FiArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
