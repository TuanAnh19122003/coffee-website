"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, Button, Typography, Layout, Row, Col, message, Image, Empty, InputNumber, Select } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Content } = Layout;

const CartPage = () => {
    const [cart, setCart] = useState<{ id: string; quantity: number; size: string }[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    const { Option } = Select;
    

    const getProductPrice = (product: any, size: string) => {
        const selectedSize = product.product_sizes.find((item: any) => item.size === size);

        if (!selectedSize) {
            return 0;
        }

        const price = selectedSize.discount_price > 0 ? selectedSize.discount_price : selectedSize.price;

        const formatPrice = (price: any) => {
            if (!price) return 0;
            const cleanPrice = Number(String(price).replace(/\D/g, ""));
            return isNaN(cleanPrice) ? 0 : cleanPrice;
        };

        return formatPrice(price);
    };


    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
            setCart(storedCart);
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                    const cartProducts = response.data.products.filter((p: any) => cart.some(item => item.id === p.id));
                    setProducts(cartProducts);
                } catch (error) {
                    console.error("Error fetching cart products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, [cart]);

    const updateQuantity = (id: string, quantity: number) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));

        // Update total amount
        updateTotalAmount(updatedCart);
    };

    const removeFromCart = (id: string) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const newCart = cart.filter((item) => item.id !== id);
        setCart(newCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
        message.success("Đã xóa khỏi giỏ hàng");
        updateTotalAmount(newCart);
    };

    const updateTotalAmount = (cartItems: { id: string; quantity: number; size: string }[]) => {
        if (products.length > 0) {
            const total = cartItems.reduce((sum, cartItem) => {
                const product = products.find((product) => product.id === cartItem.id);
                if (!product) return sum;

                const selectedSize = product.product_sizes.find((size: any) => size.size === cartItem.size);
                if (!selectedSize) return sum;

                const formatPrice = (price: any) => {
                    if (!price) return 0;
                    const cleanPrice = Number(String(price).replace(/\D/g, ""));
                    return isNaN(cleanPrice) ? 0 : cleanPrice;
                };

                // Kiểm tra lại để chắc chắn lấy đúng giá theo size và số lượng
                const price = selectedSize.discount_price > 0
                    ? formatPrice(selectedSize.discount_price)
                    : formatPrice(selectedSize.price);

                return sum + price * cartItem.quantity;
            }, 0);

            setTotalAmount(total);
        } else {
            setTotalAmount(0);
        }
    };



    useEffect(() => {
        updateTotalAmount(cart);
    }, [cart, products]);

    return (
        <Layout className="mx-auto p-4 mt-16">
            <Content className="p-4 flex-grow">
                <Title level={2}>Giỏ hàng</Title>

                {loading ? (
                    <p>Đang tải...</p>
                ) : cart.length === 0 ? (
                    <Empty
                        description="Giỏ hàng trống"
                        image={<ShoppingCartOutlined style={{ fontSize: "48px", color: "gray" }} />}
                    >
                        <Link href="/">
                            <Button type="primary">Mua sắm ngay</Button>
                        </Link>
                    </Empty>
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {products.map((product) => {
                                const cartItem = cart.find((item) => item.id === product.id);
                                const quantity = cartItem ? cartItem.quantity : 1;
                                const size = cartItem ? cartItem.size : "Chưa chọn size"; // Lấy size từ giỏ hàng

                                return (
                                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                        <Card
                                            className="relative"
                                            hoverable
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}` || "/images/placeholder.png"}
                                                alt={product.name}
                                                style={{
                                                    width: "100%",
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Title level={4}>{product.name}</Title>
                                            <p className="text-gray-500">Category: {product.category?.name || "No category"}</p>
                                            <p className="text-lg font-semibold text-red-500">
                                                {getProductPrice(product, size).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}{" "}
                                            </p>

                                            {/* Dropdown để chọn lại size */}
                                            <p className="text-sm text-gray-600">Size:</p>
                                            <Select
                                                value={size}
                                                onChange={(newSize) => {
                                                    const updatedCart = cart.map((item) =>
                                                        item.id === product.id ? { ...item, size: newSize } : item
                                                    );
                                                    setCart(updatedCart);
                                                    localStorage.setItem(`cart_${localStorage.getItem("userId")}`, JSON.stringify(updatedCart));
                                                    updateTotalAmount(updatedCart);
                                                }}
                                                style={{ width: "100%" }}
                                            >
                                                {product.product_sizes.map((item:any) => (
                                                    <Option key={item.size} value={item.size}>
                                                        {item.size}
                                                    </Option>
                                                ))}
                                            </Select>

                                            <div className="flex justify-between items-center mt-4">
                                                <Button
                                                    type="primary"
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() => removeFromCart(product.id)}
                                                >
                                                    Xóa
                                                </Button>
                                                <InputNumber
                                                    min={1}
                                                    value={quantity}
                                                    onChange={(value) => updateQuantity(product.id, value || 1)}
                                                    style={{ width: "80px" }}
                                                />
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}

                        </Row>

                        <div className="flex justify-between mt-6">
                            <div className="text-xl font-semibold">
                                Tổng tiền: {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </div>
                            <Link href="/checkout">
                                <Button type="primary" className="h-full">
                                    Tiến hành thanh toán
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
