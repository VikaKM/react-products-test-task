export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  thumbnail: string;
  category: string;
  sku?: string;
}

interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error("Ошибка загрузки товаров");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Ошибка поиска товаров");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}
