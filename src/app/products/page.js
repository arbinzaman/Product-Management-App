'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '../../redux/slices/productSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, status, error } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token); // token from Redux (persisted via localStorage)

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts({ token })); // dispatch thunk with token
    }
  }, [token, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="p-8 bg-richBlack min-h-screen text-aliceBlue">
      <h1 className="text-3xl font-bold mb-6 text-sage">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/products/${p.slug}`)}
            className="bg-aliceBlue p-4 rounded shadow cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="font-bold text-richBlack">{p.name}</h2>
            <p className="text-richBlack">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
