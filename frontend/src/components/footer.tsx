import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 shadow-sm mt-8">
            <div className="w-full mx-auto max-w-screen-xl px-6 py-4 md:flex md:items-center md:justify-between">
                {/* Bản quyền */}
                <span className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left block mb-4 md:mb-0">
                    © {new Date().getFullYear()}
                    <a href="/" className="hover:underline font-semibold"> Coffee Shop™</a> - All rights reserved.
                </span>

                {/* Menu */}
                <ul className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <li>
                        <a href="/products" className="hover:underline">Product</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}