"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: "", message: "Đang đăng nhập..." });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData, { withCredentials: true });
            
            if (response.status >= 200 && response.status < 300) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setStatus({ type: "success", message: "Đăng nhập thành công!" });
                
                // Chuyển hướng sau 1.5 giây
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setStatus({ type: "error", message: "Sai email hoặc mật khẩu" });
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setStatus({ type: "error", message: "Đăng nhập thất bại!" });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Login
                </button>
            </form>

            {/* Link to Register Page */}
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <Link href="/auth/register" className="text-blue-500 hover:underline">
                        Đăng ký
                    </Link>
                </span>
            </div>
        </div>
    );
}
