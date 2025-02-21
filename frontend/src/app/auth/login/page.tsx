"use client";
import React, { useState, useEffect } from "react";
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
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); // Thay đổi trạng thái khi nhấn vào icon
    };

    useEffect(() => {
        // Lấy email từ localStorage và gán vào formData nếu có
        const storedEmail = localStorage.getItem("registeredEmail");
        if (storedEmail) {
            setFormData((prevData) => ({ ...prevData, email: storedEmail }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: "", message: "Logging in..." });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData, { withCredentials: true });
            
            if (response.status >= 200 && response.status < 300) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setStatus({ type: "success", message: "Login successful!" });
                
                setTimeout(() => {
                    if (response.data.user.role.name === 'Admin') {
                        router.push('http://localhost:5000')
                    } else {
                        router.push('/');
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                }, 1500);
            } else {
                setStatus({ type: "error", message: "Incorrect email or password" });
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setStatus({ type: "error", message: "Login failed!" });
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
                <div className="relative">
                    <label className="block font-medium">Password</label>
                    <input
                        type={passwordVisible ? "text" : "password"} // Hiển thị mật khẩu nếu passwordVisible là true
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md pr-10" // Thêm padding phải để chứa icon
                    />
                    <button
                        type="button"
                        onClick={handlePasswordVisibility}
                        className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500"
                    >
                        {passwordVisible ? (
                            <i className="fas fa-eye-slash"></i> // Icon ẩn mật khẩu
                        ) : (
                            <i className="fas fa-eye"></i> // Icon hiển thị mật khẩu
                        )}
                    </button>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Login
                </button>
            </form>

            {/* Link to Register Page */}
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    );
}
