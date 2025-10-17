'use client';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email) return alert('Please enter your email');
    setLoading(true);
    try {
      const res = await axios.post('https://api.bitechx.com/auth', { email });
      dispatch(setToken(res.data.token));
      router.push('/products');
    } catch (err) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F2FF] to-[#D3E2EE] px-4">
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#1E40AF] mb-6">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-5 border text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] placeholder-gray-400 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#A7C4DC] to-[#91B5DD] text-white font-semibold py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        >
          {loading ? <PacmanLoader color="#ffffff" size={20} /> : 'Login'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Enter your email to access your account
        </p>
      </div>
    </div>
  );
}
