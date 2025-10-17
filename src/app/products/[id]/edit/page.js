'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id;
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    images: [''],
  });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Get token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Fetch product
  useEffect(() => {
    if (!token || !id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://api.bitechx.com/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          images: data.images.length ? data.images : [''],
        });
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    };
    fetchProduct();
  }, [token, id]);

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
      const res = await fetch(`https://api.bitechx.com/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      router.push(`/products/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Modern themed loader
  if (status === 'loading')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F2FF] to-[#F0FAFF] px-4">
        <div className="flex flex-col items-center justify-center w-80 h-80">
          <PacmanLoader color="#A7C4DC" size={60} />
          {/* <p className="mt-6 text-[#1E40AF] font-semibold text-lg">Loading Product...</p> */}
        </div>
      </div>
    );

  if (status === 'failed') 
    return <p className="text-center text-red-500 mt-24 text-lg">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FF] px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-[#1E40AF] mb-6">
          Edit Product
        </h1>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition resize-none"
            rows={4}
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 text-black rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7C4DC] transition"
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#A7C4DC] to-[#91B5DD] text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
          >
            {submitting ? <PacmanLoader color="#fff" size={20} /> : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
