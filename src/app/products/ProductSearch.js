'use client';
import { useState, useEffect } from 'react';

export default function ProductSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  // Debounce to avoid API flooding
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
      className="w-full p-2 mb-4 rounded border border-sage text-richBlack"
    />
  );
}
