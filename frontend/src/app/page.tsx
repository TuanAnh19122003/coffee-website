import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <main className="p-8 text-center">
        <h2 className="text-4xl font-semibold mb-4">Welcome to the homepage!</h2>
        <p className="mt-4 text-lg">This is a simple Next.js app with a header and footer using Tailwind CSS.</p>
      </main>
    </div>
  );
}
