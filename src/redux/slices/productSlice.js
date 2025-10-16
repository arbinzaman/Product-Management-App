// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ token, offset = 0, limit = 10, search = '' }) => {
    const res = await axios.get(
      `https://api.bitechx.com/products?offset=${offset}&limit=${limit}${search ? `&searchedText=${search}` : ''}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
