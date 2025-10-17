"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts } from "../../redux/slices/productSlice";
import { logout } from "../../redux/slices/authSlice";
import { PacmanLoader } from "react-spinners";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, totalCount, status, error } = useSelector(
    (state) => state.products
  );
  const token = useSelector((state) => state.auth.token);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch categories
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.bitechx.com/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch products
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(
      fetchProducts({
        token,
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        search: searchQuery,
        categoryId: selectedCategory,
      })
    );
  }, [token, dispatch, router, searchQuery, selectedCategory, currentPage]);

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 0;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Loading state
  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <PacmanLoader color="#3B82F6" size={80} />
      </div>
    );

  // Error state
  if (status === "failed")
    return (
      <p className="text-center text-red-500 mt-24 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-10 md:px-12 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E40AF]">
          Products
        </h1>

        {/* Button group */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/products/create")}
            className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            + Add Product
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:max-w-xs p-3 rounded-full border-2 border-[#D3E2EE] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D3E2EE] shadow-md text-sm transition duration-300"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:max-w-xs p-3 rounded-full border-2 border-[#D3E2EE] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D3E2EE] shadow-md text-sm transition duration-300"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length ? (
          products.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/products/${p.slug}`)}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="h-40 sm:h-44 overflow-hidden rounded-t-xl">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                />
              </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-1 rounded-full border transition ${
                page === currentPage
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
