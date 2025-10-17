'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners';

export default function Home() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      // Redirect to products page if logged in
      router.push('/products');
    } else {
      // Redirect to login page if not logged in
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-richBlack flex items-center justify-center">
      <PacmanLoader color="#3B82F6" size={80} />
    </div>
  );
}
