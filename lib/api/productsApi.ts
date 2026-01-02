import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../productsApi';

const BASE_URL = "https://fakestoreapi.com";

// Transform API response to match our Product type
const transformProduct = (product: any): Product => ({
  ...product,
  name: product.title,
  imageUrl: product.image,
  ratingValue: product.rating?.rate ?? 0,
  reviewCount: product.rating?.count ?? 0,
  availableStock: Math.floor(Math.random() * 50) + 1, // Mock stock for demo
});

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Product', 'Products'],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (response: any[]): Product[] => {
        return response.map(transformProduct);
      },
      providesTags: ['Products'],
    }),
    // Get single product by ID
    getProduct: builder.query<Product, string | number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any): Product => {
        return transformProduct(response);
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    // Get products by category
    getProductsByCategory: builder.query<Product[], string>({
      query: (category) => `/products/category/${category}`,
      transformResponse: (response: any[]): Product[] => {
        return response.map(transformProduct);
      },
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductsByCategoryQuery,
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
} = productsApi;

