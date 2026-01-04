export type Product = {
  id: number;
  title: string;
  name?: string; 
  price: number;
  description: string;
  category: string;
  image: string;
  imageUrl?: string; 
  rating?: {
    rate: number;
    count: number;
  };
  ratingValue?: number;
  reviewCount?: number;
  availableStock?: number;
};

const BASE_URL = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const products = await res.json();
  
  return products.map((p: any) => ({
    ...p,
    name: p.title,
    imageUrl: p.image,
    ratingValue: p.rating?.rate ?? 0,
    reviewCount: p.rating?.count ?? 0,
    availableStock: Math.floor(Math.random() * 50) + 1, // Mock stock for demo
  }));
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  const product = await res.json();
  
  return {
    ...product,
    name: product.title,
    imageUrl: product.image,
    ratingValue: product.rating?.rate ?? 0,
    reviewCount: product.rating?.count ?? 0,
    availableStock: Math.floor(Math.random() * 50) + 1, 
  };
}


