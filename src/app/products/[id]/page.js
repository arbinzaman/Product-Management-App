'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';
import BackButton from '@/shared/BackButton';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    const fetchProduct = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`https://api.bitechx.com/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    };

    fetchProduct();
  }, [token, id]);

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <span>Are you sure you want to delete this product?</span>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={async () => {
              setDeleting(true);
              try {
                const res = await fetch(`https://api.bitechx.com/products/${id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to delete');
                toast.dismiss(t.id);
                toast.success('Product deleted successfully');
                router.push('/products');
              } catch (err) {
                toast.error(err.message);
              } finally {
                setDeleting(false);
              }
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: { minWidth: '300px' }
    });
  };

  if (status === 'loading')
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E0F2FF]">
        <PacmanLoader color="#A7C4DC" size={80} />
      </div>
    );

  if (status === 'failed')
    return <p className="text-center text-red-500 mt-24 text-lg">{error}</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#E0F2FF] px-4 py-10">
      <Toaster position="top-center" />

      {/* Top Bar with BackButton */}
      <div className="sticky top-0 z-50 mb-6 rounded-xl p-3 flex items-center gap-3 ">
        <BackButton />
        
      </div>

      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-auto p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6">
          <h1 className="text-xl md:text-3xl font-bold text-[#1E40AF]">
          {product.name}
        </h1>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full sm:w-1/2 h-80 object-cover rounded-xl shadow"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="mb-4 text-gray-700">{product.description}</p>
              <p className="text-xl font-bold text-[#1E40AF]">${product.price}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                className="flex-1 sm:flex-none py-3 px-6 bg-gradient-to-r from-[#A7C4DC] to-[#91B5DD] text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                onClick={() => router.push(`/products/${id}/edit`)}
              >
                Edit
              </button>
              <button
                className={`flex-1 sm:flex-none py-3 px-6 bg-red-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
