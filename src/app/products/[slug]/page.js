'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams(); // <-- use this hook
  const slug = params.slug; // now slug is safe to access
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // safely get token from localStorage on client
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token || !slug) return;

    const fetchProduct = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`https://api.bitechx.com/products/${slug}`, {
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
  }, [slug, token]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!product) return null;

  return (
    <div className="p-8 bg-richBlack min-h-screen text-aliceBlue">
      <h1 className="text-3xl font-bold mb-6 text-sage">{product.name}</h1>
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <p className="mb-2">{product.description}</p>
      <p className="font-bold">${product.price}</p>

      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-sage rounded text-richBlack"
          onClick={() => router.push(`/products/${product.id}/edit`)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-600 rounded text-white"
          onClick={async () => {
            if (!confirm('Are you sure?')) return;
            try {
              const res = await fetch(`https://api.bitechx.com/products/${product.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) throw new Error('Failed to delete');
              router.push('/products');
            } catch (err) {
              alert(err.message);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
