"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, Spin, Typography, Layout, Menu, Row, Col, Image, Empty, Pagination } from "antd";

const { Title } = Typography;
const { Sider, Content } = Layout;

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // 8 sản phẩm mỗi trang, không cần để state

    useEffect(() => {
        // Fetch products and categories in parallel to reduce waiting time
        const fetchData = async () => {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
                ]);
                setProducts(productsResponse.data.products);
                setCategories(categoriesResponse.data.categories);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Lọc sản phẩm theo danh mục
    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category?.id === selectedCategory)
        : products;

    // Cắt danh sách theo trang
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const categoryItems = [
        { label: "All Products", key: "all", onClick: () => setSelectedCategory(null) },
        ...categories.map((category) => ({
            label: category.name,
            key: category.id,
            onClick: () => setSelectedCategory(category.id),
        })),
    ];

    return (
        <Layout className="flex mx-auto p-4 mt-16">
            {/* Sidebar Category Filter */}
            <Sider width={250} className="p-4 bg-white shadow-md rounded-lg">
                <Title level={4} className="text-center">Categories</Title>
                <Menu
                    mode="inline"
                    selectedKeys={selectedCategory ? [selectedCategory] : ["all"]}
                    items={categoryItems}
                />
            </Sider>

            {/* Product List */}
            <Content className="p-4 flex-grow">
                <Title level={2} className="text-center mb-6">Products</Title>
                {loading ? (
                    <Spin size="large" className="block mx-auto" />
                ) : paginatedProducts.length === 0 ? (
                    <Empty description="No products available" className="mt-10" />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {paginatedProducts.map((product) => (
                                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        hoverable
                                        style={{
                                            height: 380,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                        cover={
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                                                alt={product.name}
                                                className="rounded-lg"
                                                style={{ height: 200, objectFit: "cover", objectPosition: "center" }}
                                            />
                                        }
                                    >
                                        <Title
                                            level={4}
                                            style={{
                                                height: 48,
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {product.name}
                                        </Title>
                                        <p className="text-gray-500">Category: {product.category?.name || "No category"}</p>

                                        {/* Hiển thị giá tiền */}
                                        <p className="text-lg font-semibold text-red-500">
                                            {product.discount > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-500">
                                                        {product.default_price.toLocaleString("vi-VN")}
                                                    </span>
                                                    {" "}
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

                        {/* Pagination */}
                        <div className="flex justify-center mt-6">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProducts.length}
                                onChange={handlePageChange}
                                showSizeChanger={false} // No need for size changer since pageSize is constant
                            />
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default ProductsPage;
