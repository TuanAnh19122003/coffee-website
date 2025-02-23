"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, Spin, Typography, Layout, Row, Col, Empty, Button, Image } from "antd";

const { Title } = Typography;
const { Content } = Layout;

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Kiểm tra đăng nhập

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);
        const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || favorites.length === 0) {
            setLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                const allProducts = response.data.products;

                const favoriteProducts = allProducts.filter((product: any) => favorites.includes(product.id));
                setProducts(favoriteProducts);
            } catch (error) {
                console.error("Error fetching favorite products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [favorites, isAuthenticated]);

    return (
        <Layout className="flex mx-auto p-4 mt-16">
            <Content className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}>Favorites</Title>
                    <Link href="/products">
                        <Button type="default">Back to Products</Button>
                    </Link>
                </div>

                {loading ? (
                    <Spin size="large" className="block mx-auto" />
                ) : !isAuthenticated ? ( 
                    <div className="text-center mt-10">
                        <Empty description="You need to log in to see favorites" />
                        <Link href="/auth/login">
                            <Button type="primary" className="mt-4">Login</Button>
                        </Link>
                    </div>
                ) : products.length === 0 ? (
                    <Empty description="No favorite products" className="mt-10" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {products.map((product) => (
                            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                <Card hoverable className="relative">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}` || "/images/placeholder.png"}
                                        alt={product.name}
                                        style={{
                                            width: "400px",
                                            height: "200px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <Title level={4}>{product.name}</Title>
                                    <p className="text-lg font-semibold text-red-500">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="line-through text-gray-500">
                                                    {product.default_price.toLocaleString("vi-VN")}
                                                </span>{" "}
                                                {Number(product.discount_price).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </>
                                        ) : (
                                            <>{product.default_price.toLocaleString("vi-VN")}</>
                                        )}
                                    </p>
                                    <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline">
                                        View Details
                                    </Link>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Content>
        </Layout>
    );
};

export default FavoritesPage;
