'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';
import BackButton from '@/shared/BackButton';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;
const [product, setProduct] = useState(null);
console.log(product);
  const [token, setToken] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    images: [''],
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Get token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    if (!token) return;
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`https://api.bitechx.com/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [token]);

  // ✅ Fetch product
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

      // ✅ store in product state
      setProduct(data);

      // ✅ populate form with fetched data
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images.length ? data.images : [''],
        categoryId: data.categoryId || '',
      });

      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  fetchProduct();
}, [token, id]);

  // ✅ Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('images')) {
      const index = parseInt(name.split('[')[1]);
      const newImages = [...form.images];
      newImages[index] = value;
      setForm({ ...form, images: newImages });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ''] });
  const removeImageField = (idx) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: newImages.length ? newImages : [''] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const res = await fetch(`https://api.bitechx.com/products/${product?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        images: form.images.filter((img) => img),
        categoryId: form.categoryId,
      }),
    });

    if (!res.ok) throw new Error('Failed to update product');

    toast.success('Product updated successfully!');

    // ✅ Redirect to product details and reload
    router.push(`/products`);
    // OR if you want a hard reload:
    // router.replace(`/products/${product?.id}`);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setSubmitting(false);
  }
};


  if (status === 'loading')
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E0F2FF]">
        <PacmanLoader color="#A7C4DC" size={60} />
      </div>
    );

  if (status === 'failed')
    return <p className="text-center text-red-500 mt-24 text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-[#E0F2FF] px-4 py-10">
      <Toaster position="top-center" />

      {/* ✅ Top Bar */}
      <div className="sticky top-0 z-50 mb-6 rounded-xl p-3 flex items-center justify-between md:justify-between gap-3 shadow-md">
        <BackButton />
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Logout
        </button>
      </div>

      {/* ✅ Form Container */}
      <div className="bg-white w-full max-w-lg mx-auto rounded-2xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#1E40AF]">Edit Product</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition resize-none"
            rows={4}
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
            required
          />

          {/* Images */}
          <div className="flex flex-col gap-3">
            {form.images.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  name={`images[${idx}]`}
                  value={img}
                  onChange={handleChange}
                  placeholder={`Image ${idx + 1} URL`}
                  className="flex-1 p-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
                  required
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="w-full py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-semibold"
            >
              + Add Image
            </button>
          </div>

          {/* Category */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full p-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
            required
            disabled={loadingCategories}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
          >
            {submitting ? <PacmanLoader color="#fff" size={20} /> : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
