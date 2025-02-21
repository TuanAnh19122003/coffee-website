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
    const [errors, setErrors] = useState<any>({}); // Lưu các lỗi của từng trường

    React.useEffect(() => {
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(randomCode);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Kiểm tra ngay khi người dùng thay đổi giá trị
        validate(name, value);
    };

    const validate = (fieldName: string, value: string) => {
        const newErrors: any = { ...errors };

        switch (fieldName) {
            case "firstName":
            case "lastName":
                if (!value) {
                    newErrors[fieldName] = `${fieldName} is required`;
                } else {
                    delete newErrors[fieldName];
                }
                break;
            case "email":
                if (!value) {
                    newErrors[fieldName] = "Email is required";
                } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    newErrors[fieldName] = "Please enter a valid email address";
                } else {
                    delete newErrors[fieldName];
                }
                break;
            case "password":
                if (!value) {
                    newErrors[fieldName] = "Password is required";
                } else if (value.length < 6) {
                    newErrors[fieldName] = "Password must be at least 6 characters";
                } else if (!/[A-Z]/.test(value)) {
                    newErrors[fieldName] = "Password must contain at least one uppercase letter";
                } else if (!/[a-z]/.test(value)) {
                    newErrors[fieldName] = "Password must contain at least one lowercase letter";
                } else if (!/[0-9]/.test(value)) {
                    newErrors[fieldName] = "Password must contain at least one number";
                } else if (!/[^A-Za-z0-9]/.test(value)) {
                    newErrors[fieldName] = "Password must contain at least one special character";
                } else {
                    delete newErrors[fieldName];
                }
                break;
            case "confirmPassword":
                if (value !== formData.password) {
                    newErrors[fieldName] = "Passwords do not match";
                } else {
                    delete newErrors[fieldName];
                }
                break;
            case "verificationCode":
                if (value !== generatedCode) {
                    newErrors[fieldName] = "Incorrect verification code";
                } else {
                    delete newErrors[fieldName];
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: "", message: "Registering..." });

        if (Object.keys(errors).length > 0) return; // Nếu có lỗi thì không gửi form

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            if (response.status >= 200 && response.status < 300) {
                setStatus({ type: "success", message: "Registration successful!" });
                localStorage.setItem("registeredEmail", formData.email);

                setTimeout(() => {
                    router.push("/auth/login");
                }, 1500);
            } else {
                setStatus({ type: "error", message: "Registration failed!" });
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setStatus({ type: "error", message: "An error occurred!" });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

            {status.message && (
                <motion.div
                    className={`text-center p-2 mb-4 rounded-md ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
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
                    {errors.firstName && <small className="text-red-500">{errors.firstName}</small>}
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
                    {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
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
                    {errors.email && <small className="text-red-500">{errors.email}</small>}
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
                    {errors.password && <small className="text-red-500">{errors.password}</small>}
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
                    {errors.confirmPassword && <small className="text-red-500">{errors.confirmPassword}</small>}
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
                    <small className="text-gray-500">Verification Code: {generatedCode}</small>
                    {errors.verificationCode && <small className="text-red-500">{errors.verificationCode}</small>}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                    Register
                </button>
            </form>
        </div>
    );
}
