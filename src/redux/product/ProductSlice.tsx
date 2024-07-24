import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  rate: number;
  price: number;
  color: string;
  size: string;
}

interface ProductState {
  isLoading: boolean;
  isError: boolean;
  value: Product[];
}

const initialState: ProductState = {
  isLoading: false,
  isError: false,
  value: []
}


export const fetchProduct = createAsyncThunk<Product[]>(
  'products/fetchProduct',
  async () => {
    const response = await axios.get("https://ecommerce-backend-fawn-eight.vercel.app/api/products");
    return response.data;
  }
)


export const editProduct = createAsyncThunk<Product, { _id: string, data: Partial<Product> }>(
  'products/editProduct',
  async ({ _id, data }) => {
    const response = await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${_id}`, data);
    return response.data;
  }
)

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload;
        state.value = state.value.map(product =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(editProduct.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
})

export default ProductSlice.reducer;
