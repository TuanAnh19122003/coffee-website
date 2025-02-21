"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        verificationCode: "",
        firstName: "",  
        lastName: "",   
    });

    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

    React.useEffect(() => {
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(randomCode);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: "", message: "Đang đăng ký..." });

        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: "error", message: "Mật khẩu và mật khẩu xác nhận không khớp!" });
            return;
        }

        if (formData.verificationCode !== generatedCode) {
            setStatus({ type: "error", message: "Mã xác nhận không đúng!" });
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,    
            });

            if (response.status >= 200 && response.status < 300) {
                setStatus({ type: "success", message: "Đăng ký thành công!" });

                setTimeout(() => {
                    router.push("/auth/login");
                }, 1500);
            } else {
                setStatus({ type: "error", message: "Đăng ký thất bại!" });
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setStatus({ type: "error", message: "Có lỗi xảy ra!" });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

            {status.message && (
                <motion.div
                    className={`text-center p-2 mb-4 rounded-md ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
                    <label className="block font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium">Verification Code</label>
                    <input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                    <small className="text-gray-500">Mã xác nhận: {generatedCode}</small>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Register
                </button>
            </form>
        </div>
    );
}
