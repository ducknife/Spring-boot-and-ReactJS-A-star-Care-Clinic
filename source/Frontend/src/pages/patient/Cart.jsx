import { useEffect, useMemo, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import AppointmentCard from "./AppointmentCard";
import { motion } from "framer-motion";
import { appointmentService } from "../../api/services";

const item = {
    hidden: { opacity: 0, y: 8 },
    show: i => ({
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 25,
            mass: 0.8,
            delay: i * 0.02,
        },
    }),
};

function Cart() {
    const id = getUserId();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const getPendingAppointments = async () => {
            try {
                const pendingAppointments = await appointmentService.pendingByPatientId(id);
                setData(pendingAppointments);

            }
            catch (err) {
                console.log(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        getPendingAppointments();

    }, [id]);

    if (loading) return <p className="text-center text-gray-500 py-10">Đang tải...</p>;

    return (
        <section className="bg-gradient-to-tl from-sky-50 via-white to-sky-500 min-h-[40vh]">
            <div className="max-w-6xl mx-auto py-8 px-4">

                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", damping: 22, stiffness: 180 }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8"
                >
                    <div className="bg-white w-fit h-fit p-3 rounded-2xl shadow-lg">
                        <h1 className="text-4xl font-bold text-[#00278D]">Giỏ dịch vụ của bạn</h1>
                    </div>

                </motion.div>

                {data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((a, i) => (
                            <motion.div
                                key={a.id}
                                custom={i}
                                variants={item}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.15 }}
                                className="will-change-transform transform-gpu"
                                whileHover={{ translateY: -4 }}
                                transition={{ type: "spring", damping: 24 }}
                            >
                                <div className="transition-shadow duration-200 hover:shadow-xl rounded-xl">
                                    <AppointmentCard appointment={a} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
        </section>
    );
}

export default Cart;
