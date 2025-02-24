"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Table, Button, Typography, Layout, message, Image, Empty, InputNumber, Select } from "antd";
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
    
        // Kiểm tra xem sản phẩm có giảm giá không và trả về giá đã giảm
        const price = selectedSize.discount_price > 0 ? selectedSize.discount_price : selectedSize.priceProduct;

    
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
    
                const price = getProductPrice(product, cartItem.size); // Sử dụng giá đã tính
                return sum + (price * cartItem.quantity);
            }, 0);
    
            setTotalAmount(total); // Cập nhật tổng số tiền
        }
    };
    

    useEffect(() => {
        updateTotalAmount(cart);
    }, [cart, products]);

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "product",
            render: (text: any, record: any) => (
                <div className="flex items-center">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${record.image}` || "/images/placeholder.png"}
                        alt={record.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "10px" }}
                    />
                </div>
            ),
        },
        {
            title: "Tên",
            dataIndex: "name",
            render: (text: any, record: any) => (
                <span>
                    {record.name}
                </span>
            ),
        },
        {
            title: "Size",
            dataIndex: "size",
            render: (text: string, record: any) => (
                <Select
                    value={record.size}
                    onChange={(newSize) => {
                        const updatedCart = cart.map((item) =>
                            item.id === record.id ? { ...item, size: newSize } : item
                        );
                        setCart(updatedCart);
                        localStorage.setItem(`cart_${localStorage.getItem("userId")}`, JSON.stringify(updatedCart));
                        updateTotalAmount(updatedCart);
                    }}
                    style={{ width: "100px" }}
                >
                    {record.product_sizes.map((item: any) => (
                        <Option key={item.size} value={item.size}>
                            {item.size}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            render: (text: any, record: any) => (
                <span>
                    {getProductPrice(record, record.size).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </span>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            render: (text: any, record: any) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => updateQuantity(record.id, value || 1)}
                    style={{ width: "80px" }}
                />
            ),
        },
        {
            title: "Hành động",
            dataIndex: "action",
            render: (text: any, record: any) => (
                <Button
                    type="primary"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => removeFromCart(record.id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

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
                        <Table
                            columns={columns}
                            dataSource={products.map((product) => ({
                                ...product,
                                product_sizes: product.product_sizes,
                                size: cart.find((item) => item.id === product.id)?.size || "Chưa chọn size",
                                quantity: cart.find((item) => item.id === product.id)?.quantity || 1,
                            }))}
                            rowKey="id"
                            pagination={false}
                        />

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
