"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Thêm animation mượt mà

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        subjectName: "",
        note: "",
    });

    const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: "", message: "Đang gửi feedback..." });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/create`, formData);

            if (response.status >= 200 && response.status < 300) {
                setStatus({ type: "success", message: "Gửi feedback thành công!" });

                // Reset form sau khi gửi thành công
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    subjectName: "",
                    note: "",
                });

                // Ẩn thông báo sau 3 giây
                setTimeout(() => {
                    setStatus({ type: "", message: "" });
                }, 3000);
            } else {
                setStatus({ type: "error", message: "Không thể gửi feedback, thử lại sau" });
            }
        } catch (error) {
            console.error("Lỗi gửi feedback:", error);
            setStatus({ type: "error", message: "Gửi feedback thất bại" });
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Submit Feedback</h2>

            {/* Hiển thị thông báo với hiệu ứng động */}
            {status.message && (
                <motion.div
                    className={`text-center p-2 mb-4 rounded-md ${
                        status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {status.message}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} method="post" className="space-y-4">
                <div>
                    <label className="block font-medium">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Subject</label>
                    <input
                        type="text"
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Note</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        rows={4}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Submit
                </button>
            </form>
        </div>
    );
}
