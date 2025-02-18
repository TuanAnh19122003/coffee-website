"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách sản phẩm và các size sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.products); // Giả sử backend trả về danh sách sản phẩm với product_sizes
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No products available</p>
      ) : (
        <ul className="space-y-6">
          {products.map((product: any) => (
            <li key={product.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-6">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-sm">Category: {product.category?.name || 'No category'}</p>
                  <p className="mt-2 text-gray-700">Description: {product.description || 'No description available'}</p>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Sizes and Prices:</h3>
                    {product.product_sizes && product.product_sizes.length > 0 ? (
                      <ul className="space-y-2 mt-2">
                        {product.product_sizes.map((size: any) => (
                          <li key={size.id} className="flex justify-between items-center">
                            <span className="font-medium">{size.size || 'No size'}</span>
                            <span className="text-gray-500">
                              Price: {size.price ? `$${size.price}` : 'N/A'} | Discounted Price:{" "}
                              {size.priceProduct ? `$${size.priceProduct}` : 'N/A'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No sizes available</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
