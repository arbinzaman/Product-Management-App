'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // gets id
  const id = params.id;       // <-- use id here
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

  // Get token safely
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Fetch product by ID
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
          images: data.images,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  if (status === 'loading') return <p>Loading product...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="p-8 bg-richBlack min-h-screen text-aliceBlue">
      <h1 className="text-3xl font-bold mb-6 text-sage">Edit Product</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 rounded text-richBlack"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded text-richBlack"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 rounded text-richBlack"
        />
        {form.images.map((img, idx) => (
          <input
            key={idx}
            name={`images[${idx}]`}
            value={img}
            onChange={handleChange}
            placeholder={`Image ${idx + 1} URL`}
            className="p-2 rounded text-richBlack"
          />
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-sage rounded text-richBlack hover:bg-aliceBlue"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
