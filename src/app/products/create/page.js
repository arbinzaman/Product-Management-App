'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function CreateProductPage() {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [''],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://api.bitechx.com/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      setError('Name, Price, and Category are required.');
      return;
    }

    try {
      const res = await fetch('https://api.bitechx.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });
      if (!res.ok) throw new Error('Failed to create product');
      router.push('/products');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 bg-richBlack min-h-screen text-aliceBlue">
      <h1 className="text-3xl font-bold mb-6 text-sage">Create Product</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
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
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="p-2 rounded text-richBlack"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="images[0]"
          value={form.images[0]}
          onChange={(e) => setForm({ ...form, images: [e.target.value] })}
          placeholder="Image URL"
          className="p-2 rounded text-richBlack"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-sage text-richBlack rounded hover:bg-aliceBlue"
        >
          Create
        </button>
      </form>
    </div>
  );
}
