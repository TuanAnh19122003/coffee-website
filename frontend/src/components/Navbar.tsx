"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 bg-white border-b border-gray-300 shadow-md z-50">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3">
                    <Image
                        src="https://flowbite.com/docs/images/logo.svg"
                        width={32}
                        height={32}
                        alt="Flowbite Logo"
                    />
                    <span className="self-center text-2xl font-semibold text-black font-serif">
                        Xưởng Cafe
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>

                {/* Menu Items */}
                <div className="hidden w-full md:w-auto md:flex" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-white md:flex-row md:space-x-6 md:mt-0 md:border-0">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/about", label: "About" },
                            { href: "/products", label: "Product" },
                            { href: "/feedback", label: "Feedback" }
                        ].map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`block py-2 px-4 text-black rounded-md transition-all duration-300 ${
                                        pathname === href ? "font-bold" : "hover:text-gray-500"
                                    }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {/* Login */}
                    <Link
                        href="/login"
                        className="ml-6 px-4 py-2 text-black font-medium hover:font-bold hover:text-gray-500 transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};
