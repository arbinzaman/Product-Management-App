import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ token, offset = 0, limit = 10, search = '', categoryId = '' }) => {
    let url = `https://api.bitechx.com/products?offset=${offset}&limit=${limit}`;
    if (search) url += `&searchedText=${search}`;
    if (categoryId) url += `&categoryId=${categoryId}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // If API returns array only, use res.data.length or header for totalCount
    const totalCount = res.headers['x-total-count'] || res.data.length;

    return {
      products: res.data,
      totalCount: parseInt(totalCount, 10),
    };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    totalCount: 0,
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
        state.products = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
