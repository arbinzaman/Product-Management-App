'use client';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://api.bitechx.com/auth', { email });
      // console.log(res.data.token);
      dispatch(setToken(res.data.token));
      router.push('/products');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-richBlack flex items-center justify-center">
      <div className="bg-aliceBlue p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-richBlack mb-4">Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-sage rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-sage text-aliceBlue p-2 rounded hover:bg-tan"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
