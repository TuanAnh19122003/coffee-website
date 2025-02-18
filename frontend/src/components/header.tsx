import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Next.js App</h1>
        <nav>
          <Link href="/" className="mx-4 text-lg hover:text-gray-400">Home</Link>
          <Link href="/product" className="mx-4 text-lg hover:text-gray-400">Products</Link>
          <Link href="/about" className="mx-4 text-lg hover:text-gray-400">About</Link>
          <Link href="/contact" className="mx-4 text-lg hover:text-gray-400">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
