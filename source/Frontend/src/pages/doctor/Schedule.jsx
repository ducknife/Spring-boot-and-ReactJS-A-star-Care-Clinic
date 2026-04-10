import { useEffect, useState } from "react";
import AppointmentCard from "../patient/AppointmentCard";
import { getUserId } from "../../utils/authUtils";
import { motion } from "framer-motion";
import { MdOutlineCancel } from "react-icons/md";
import { appointmentService } from "../../api/services";

const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1, y: 0,
        transition: { duration: 0.2, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.06 }
    }
};
const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
};

function Schedule() {
    const [data, setData] = useState([]);
    const id = getUserId();

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await appointmentService.pendingByDoctorId(id);
                setData(response);
            }
            catch (error) {
                console.error(error.message);
            }
        };
        fetchData();

    }, [id]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-tl from-sky-50 via-white to-sky-500 min-h-[40vh]"
        >
            <div className="c py-8 px-4 max-w-7xl mx-auto">
                {/* Tiêu đề */}
                <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className="flex items-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-[#00278D] bg-white p-3 rounded-2xl shadow-lg">
                        Lịch hẹn sắp tới
                    </h1>
                </motion.div>

                {/* Danh sách */}
                {data.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
                    >
                        {data.map((a) => (
                            <motion.div
                                key={a.id}
                                variants={item}
                                whileHover={{ translateY: -4 }}
                                transition={{ type: "spring", damping: 24 }}
                                className="will-change-transform transform-gpu"
                            >
                                <div className="transition-shadow duration-200 hover:shadow-xl rounded-xl">
                                    <AppointmentCard appointment={a} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-xl text-[#00278D]"
                    >
                        {"Không có cuộc hẹn nào đang chờ."}
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}

export default Schedule;
