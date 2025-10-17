'use client';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa'; // React Icon for back arrow

export default function BackButton({ text = 'Back' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white font-medium rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <FaArrowLeft className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
}
