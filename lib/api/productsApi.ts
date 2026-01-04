import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../productsApi';

const BASE_URL = "https://fakestoreapi.com";


const transformProduct = (product: any): Product => ({
  ...product,
  name: product.title,
  imageUrl: product.image,
  ratingValue: product.rating?.rate ?? 0,
  reviewCount: product.rating?.count ?? 0,
  availableStock: Math.floor(Math.random() * 50) + 1, 
});

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Product', 'Products'],
  endpoints: (builder) => ({
   
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (response: any[]): Product[] => {
        return response.map(transformProduct);
      },
      providesTags: ['Products'],
    }),
   
    getProduct: builder.query<Product, string | number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any): Product => {
        return transformProduct(response);
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  
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



