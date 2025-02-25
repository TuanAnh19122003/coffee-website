"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Menu, Dropdown, Avatar, Button, Layout, MenuProps, message } from "antd";
import { 
    UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, 
    ShoppingCartOutlined, InfoCircleOutlined, AppstoreOutlined, 
    MessageOutlined, DashboardOutlined 
} from "@ant-design/icons";

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
                setCartCount(storedCart.length);
            }
        };

        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        return () => window.removeEventListener("storage", updateCartCount);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, { withCredentials: true });
            setUser(null);
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            message.success('Đăng xuất thành công')
            router.push('/auth/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const userMenuItems: MenuProps["items"] = [
        {
            key: "profile",
            label: <Link href="/profile">Profile</Link>,
            icon: <UserOutlined />,
        },
        {
            key: "settings",
            label: <Link href="/settings">Settings</Link>,
            icon: <SettingOutlined />,
        },
        ...(user?.role?.id === 1 ? [
            {
                key: "admin",
                label: <Link href="http://localhost:5000">Admin Dashboard</Link>,
                icon: <DashboardOutlined />,
            },
        ] : []),
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Layout.Header className="flex justify-between items-center bg-white shadow-md px-6">
            <Link href="/" className="flex items-center space-x-3">
                <Image src="/Logo.png" width={50} height={50} alt="Logo" />
                <span className="text-2xl font-semibold">Xưởng Cafe</span>
            </Link>

            <Menu
                mode="horizontal"
                selectedKeys={[pathname]}
                className="flex-1 justify-center"
                items={[
                    { key: "/", label: <Link href="/">Home</Link>, icon: <HomeOutlined /> },
                    { key: "/about", label: <Link href="/about">About</Link>, icon: <InfoCircleOutlined /> },
                    { key: "/products", label: <Link href="/products">Product</Link>, icon: <AppstoreOutlined /> },
                    { key: "/feedback", label: <Link href="/feedback">Feedback</Link>, icon: <MessageOutlined /> },
                ]}
            />

            <div className="flex items-center space-x-4">
                <Link href="/cart">
                    <Button type="text" icon={<ShoppingCartOutlined />} className="relative">
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Button>
                </Link>

                {user ? (
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.lastName} {user.firstName}</span>
                        <Dropdown menu={{ items: userMenuItems, style: { minWidth: "150px" } }} placement="bottomLeft">
                            <Avatar
                                src={user.image?.startsWith("http") ? user.image : `${process.env.NEXT_PUBLIC_API_URL}${user.image}`}
                                size={40}
                                icon={<UserOutlined />}
                                className="cursor-pointer"
                            />
                        </Dropdown>
                    </div>
                ) : (
                    <Link href="/auth/login">
                        <Button type="primary">Login</Button>
                    </Link>
                )}
            </div>
        </Layout.Header>
    );
};
