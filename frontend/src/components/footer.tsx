import React from "react";
import Link from "next/link";

export const Footer = () => {
    return (
        <div className="bg-white dark:bg-gray-900 shadow-sm mt-8 p-6">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                {/* Bản quyền */}
                <p>
                    © {new Date().getFullYear()}  
                    <Link href="/" className="hover:text-blue-500 font-semibold ml-1">
                        Coffee Shop™
                    </Link> - All rights reserved.
                </p>

                {/* Menu */}
                <div className="flex flex-wrap gap-6">
                    <Link href="/products" className="hover:text-blue-500">Products</Link>
                    <Link href="#" className="hover:text-blue-500">Privacy Policy</Link>
                    <Link href="#" className="hover:text-blue-500">Licensing</Link>
                    <Link href="#" className="hover:text-blue-500">Contact</Link>
                </div>
            </div>
        </div>
    );
};
