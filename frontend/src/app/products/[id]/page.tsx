"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import axios from "axios";
import { Card, Typography, Image, List, Spin, Alert, Button, Radio, InputNumber, message } from "antd";

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const router = useRouter(); // Khởi tạo router để quay lại trang trước
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<any>(null);
    const [quantity, setQuantity] = useState(1); // Thêm state cho số lượng

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
                setProduct(response.data.product);

                if (response.data.product.product_sizes.length > 0) {
                    setSelectedSize(response.data.product.product_sizes[0]);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <Spin size="large" className="block mx-auto mt-20" />;
    if (!product) return <Alert message="Product not found" type="error" showIcon className="mt-10" />;

    const addToCart = () => {
        const userId = localStorage.getItem("userId"); // Get userId from localStorage
        if (!userId || !selectedSize) return; // Check if the user is logged in and a size is selected
    
        // Get the stored cart (if exists)
        const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
    
        // Check if the product is already in the cart
        const existingProductIndex = storedCart.findIndex(
            (item: any) => item.id === Number(id) && item.size === selectedSize.size
        );
    
        if (existingProductIndex > -1) {
            // If the product already exists, update the quantity
            storedCart[existingProductIndex].quantity += quantity;
        } else {
            // If the product is new, add it to the cart
            storedCart.push({
                id: Number(id),
                quantity,
                size: selectedSize.size,
                price: selectedSize.priceProduct || selectedSize.price,
            });
        }
    
        // Save the updated cart to localStorage
        localStorage.setItem(`cart_${userId}`, JSON.stringify(storedCart));
    
        // Notify the user
        message.success("Sản phẩm đã được thêm vào giỏ hàng!");
    };
    

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nút Quay lại */}
            <div className="col-span-2 mb-4">
                <Button onClick={() => router.back()} className="border-gray-500 text-gray-700">
                    ← Quay lại
                </Button>
            </div>

            {/* Cột trái - Ảnh sản phẩm */}
            <div>
                <Image.PreviewGroup>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                        alt={product.name}
                        className="rounded-lg"
                        style={{ width: "100%", height: "500px", objectFit: "contain", objectPosition: "center" }}
                    />
                </Image.PreviewGroup>
            </div>

            {/* Cột phải - Thông tin sản phẩm */}
            <div>
                <Title level={2}>{product.name}</Title>
                <Text type="secondary">Category: {product.category?.name || "No category"}</Text>
                <Paragraph className="mt-3">{product.description || "No description available"}</Paragraph>

                {/* Chọn Size */}
                <Title level={4} className="mt-5">Select Size</Title>
                <Radio.Group
                    value={selectedSize?.id}
                    onChange={(e) => {
                        const size = product.product_sizes.find((s: any) => s.id === e.target.value);
                        setSelectedSize(size);
                    }}
                >
                    {product.product_sizes.map((size: any) => (
                        <Radio.Button key={size.id} value={size.id} className="mr-2">
                            {size.size}
                        </Radio.Button>
                    ))}
                </Radio.Group>

                {/* Số lượng */}
                <Title level={4} className="mt-5">Quantity</Title>
                <InputNumber
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(value) => setQuantity(value ?? 1)}
                    className="mt-2"
                />

                {/* Giá sản phẩm */}
                <Title level={3} className="mt-4">
                    {selectedSize ? (
                        <>
                            {selectedSize.priceProduct && selectedSize.priceProduct < selectedSize.price ? (
                                <>
                                    <Text delete type="secondary" className="mr-2">
                                        {Math.round(selectedSize.price).toLocaleString("vi-VN")} ₫
                                    </Text>
                                    <Text className="text-red-500">
                                        {Math.round(selectedSize.priceProduct).toLocaleString("vi-VN")} ₫
                                    </Text>
                                </>
                            ) : (
                                <Text>
                                    {Math.round(selectedSize.price).toLocaleString("vi-VN")} ₫
                                </Text>
                            )}
                        </>
                    ) : (
                        "Select a size to see the price"
                    )}
                </Title>

                {/* Nút Thêm vào giỏ hàng & Mua ngay */}
                <div className="mt-6 flex gap-4">
                    <Button type="primary" size="large" className="bg-blue-500">
                        Buy Now
                    </Button>
                    <Button size="large" onClick={addToCart} className="border-blue-500 text-blue-500">
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
