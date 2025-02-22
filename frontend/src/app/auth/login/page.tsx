"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons";

export default function LoginPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, { withCredentials: true });

                if (response.status === 200 && response.data.user) {
                    setIsAuthenticated(true);
                    message.info("Bạn đã đăng nhập rồi!");
                    setTimeout(() => {
                        if (response.data.user.role.name === "Admin") {
                            router.replace("http://localhost:5000");
                        } else {
                            router.replace("/");
                        }
                    }, 1000);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        message.loading({ content: "Logging in...", key: "login" });
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, values, { withCredentials: true });
    
            if (response.status >= 200 && response.status < 300) {
                const user = response.data.user;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userId", user.id.toString());
    
                // Lấy danh sách sản phẩm yêu thích từ localStorage
                const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
                setFavorites(storedFavorites);
    
                message.success({ content: "Login successful!", key: "login" });
                setTimeout(() => {
                    if (user.role.name === "Admin") {
                        router.replace("http://localhost:5000");
                    } else {
                        router.replace("/");
                        setTimeout(() => window.location.reload(), 100);
                    }
                }, 1000);
            }
        } catch (error: any) {
            console.error("Lỗi đăng nhập:", error);
    
            if (error.response?.status === 401) {
                message.error({ content: "Sai email hoặc mật khẩu. Vui lòng thử lại!", key: "login" });
            } else {
                message.error({ content: "Đăng nhập thất bại. Vui lòng thử lại sau!", key: "login" });
            }
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <Card title="Login" className="max-w-md mx-auto mt-10 shadow-md rounded-lg">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter your email!" }]}>
                    <Input prefix={<UserOutlined />} placeholder="Enter your email" />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password!" }]}>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter your password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            <div className="text-center">
                <span className="text-sm text-gray-500">
                    Don't have an account? <Link href="/auth/register">Sign up</Link>
                </span>
            </div>
        </Card>
    );
}
