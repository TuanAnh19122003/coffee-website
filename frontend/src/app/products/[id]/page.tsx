"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      <p className="mt-4 text-gray-700">Category: {product.category?.name || 'No category'}</p>
      <p className="mt-2 text-lg">{product.description || 'No description available'}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Sizes and Prices:</h3>
        {product.product_sizes && product.product_sizes.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {product.product_sizes.map((size: any) => (
              <li key={size.id} className="flex justify-between items-center p-2 border rounded-lg">
                <span className="font-medium">{size.size || 'No size'}</span>
                <span className="text-gray-500">
                  Price: {size.price ? `${size.price}` : 'N/A'} | Discounted Price:{" "}
                  {size.priceProduct ? `${size.priceProduct}` : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sizes available</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
