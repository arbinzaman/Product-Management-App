'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '../../redux/slices/productSlice';
import { PacmanLoader } from 'react-spinners';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, status, error } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(fetchProducts({ token }));
  }, [token, dispatch, router]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) setFilteredProducts(products);
      else
        setFilteredProducts(
          products.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery, products]);

  if (status === 'loading')
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <PacmanLoader color="#D3E2EE" size={80} />
      </div>
    );

  if (status === 'failed')
    return <p className="text-center text-red-500 mt-24 text-lg">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white px-6 py-10 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1E40AF] mb-10">
        Products
      </h1>

      {/* Search */}
      <div className="max-w-sm mx-auto mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full p-3 rounded-full border-2 border-[#D3E2EE] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D3E2EE] shadow-md text-sm transition duration-300"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/products/${p.slug}`)}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="h-40 sm:h-44 overflow-hidden rounded-t-xl">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                />
              </div>

              {/* Overlay for Name & Price */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                <h2 className="text-white font-semibold text-sm sm:text-base line-clamp-1">
                  {p.name}
                </h2>
                <p className="text-[#D3E2EE] font-medium text-sm sm:text-base mt-1">
                  ${p.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
