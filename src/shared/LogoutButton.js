'use client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar({ showBack = false }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-end items-center px-6 py-3">
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Logout
      </button>
    </nav>
  );
}
