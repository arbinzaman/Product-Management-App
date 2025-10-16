import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices.js/authSlice';
import productReducer from './slices.js/productSlice';
import categoryReducer from './slices.js/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});
