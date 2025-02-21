"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, { withCredentials: true });
            setUser(null);
            router.push('/auth/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="sticky top-0 bg-white border-b border-gray-300 shadow-md z-50">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3">
                    <Image src="/Logo.jpg" width={50} height={50} alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold text-black font-serif">Xưởng Cafe</span>
                </Link>

                {/* Menu Items */}
                <div className="hidden w-full md:w-auto md:flex" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-white md:flex-row md:space-x-6 md:mt-0 md:border-0">
                        {[{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/products", label: "Product" }, { href: "/feedback", label: "Feedback" }].map(({ href, label }) => (
                            <li key={href}>
                                <Link href={href} className={`block py-2 px-4 text-black rounded-md transition-all duration-300 ${pathname === href ? "font-bold border-b-2 border-blue-500" : "hover:text-gray-500"}`}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Giỏ hàng và User Info */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="flex items-center space-x-2">
                            <i className="fas fa-shopping-cart text-xl text-black"></i>
                            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    {/* User Info / Login */}
                    {user ? (
                        <div className="relative flex items-center space-x-4">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 p-2 rounded-md transition duration-200 ease-in-out"
                            >
                                <Image
                                    src={user.image?.startsWith("http") ? user.image : `${process.env.NEXT_PUBLIC_API_URL}${user.image}`}
                                    width={30}
                                    height={30}
                                    className="rounded-full w-9 h-9"
                                    alt="User Avatar"
                                />
                                <span className="text-black font-medium">{user.lastName} {user.firstName}</span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                                    <div className="py-2">
                                        <Link href="/profile" className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md transition duration-200 ease-in-out">
                                            <i className="fas fa-user fa-sm mr-2 text-gray-400"></i> Profile
                                        </Link>
                                        <Link href="/settings" className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md transition duration-200 ease-in-out">
                                            <i className="fas fa-cogs fa-sm mr-2 text-gray-400"></i> Settings
                                        </Link>
                                        <Link href="/activity-log" className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md transition duration-200 ease-in-out">
                                            <i className="fas fa-list fa-sm mr-2 text-gray-400"></i> Activity Log
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 rounded-b-md transition duration-200 ease-in-out">
                                            <i className="fas fa-sign-out-alt fa-sm mr-2 text-gray-400"></i> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth/login" className="ml-6 px-4 py-2 text-black font-medium hover:font-bold hover:text-gray-500 transition duration-200 ease-in-out">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>

    );
};
