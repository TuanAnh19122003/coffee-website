"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Card, Spin, Typography, Layout, Menu, Row, Col, Empty, Pagination, Button, Image, message } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Sider, Content } = Layout;

const ProductsPage = () => {
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [cart, setCart] = useState<string[]>([]);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
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

    useEffect(() => {
        const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
        if (userId) {
            const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
            setFavorites(storedFavorites);
        }
        if (userId) {
            const storedCart = JSON.parse(localStorage.getItem(`cart${userId}`) || "[]");
            setCart(storedCart);
        }

    }, []);

    const toggleFavorite = (id: string) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            message.warning("Bạn cần đăng nhập để sử dụng tính năng này!");
            return;
        }

        const storedFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
        const newFavorites = storedFavorites.includes(id)
            ? storedFavorites.filter((fav: string) => fav !== id)
            : [...storedFavorites, id];

        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));

        if (storedFavorites.includes(id)) {
            message.info("Đã xóa khỏi danh sách yêu thích");
        } else {
            message.success("Đã thêm vào danh sách yêu thích!");
        }
    };


    const addToCart = (id: string) => {
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
            message.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
            router.push("/auth/login");
            return;
        }
    
        const product = products.find(p => p.id === id);
    
        if (!product) {
            message.error("Sản phẩm không tồn tại.");
            return;
        }
    
        console.log("Default Size:", product.defaultSize); 
        console.log("Product Sizes:", product.product_sizes);
    
        // Lấy kích thước mặc định từ product.defaultSize
        const selectedSize = product.product_sizes.find((item: any) => item.size === product.defaultSize);
    
        if (!selectedSize) {
            message.error("Kích thước sản phẩm không hợp lệ.");
            return;
        }

        const price = selectedSize.discount_price > 0 ? selectedSize.discount_price : selectedSize.priceProduct;
        console.log(price)
    
        const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
    
        const existingProduct = storedCart.find((item: { id: string }) => item.id === id);
    
        if (existingProduct) {
            existingProduct.quantity += 1;
            setCart([...storedCart]);
            localStorage.setItem(`cart_${userId}`, JSON.stringify(storedCart));
            message.info("Sản phẩm đã được thêm vào giỏ hàng, số lượng tăng thêm.");
        } else {
            const newCart = [...storedCart, { id, quantity: 1, size: product.defaultSize, price }];
            setCart(newCart);
            localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
            message.success("Đã thêm vào giỏ hàng!");
        }
    };
    
    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category?.id === selectedCategory)
        : products;
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <Sider width={250} className="p-4 bg-white shadow-md rounded-lg">
                <Title level={4} className="text-center">Categories</Title>
                <Menu mode="inline" selectedKeys={selectedCategory ? [selectedCategory] : ["all"]} items={categoryItems} />
            </Sider>
            <Content className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}>Products</Title>
                    <Link href="/favorites">
                        <Button type="default" icon={<HeartOutlined />}>
                            Favorites
                        </Button>
                    </Link>
                </div>
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
                                        className="relative"
                                        style={{
                                            height: 400,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <div className="relative">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}` || "/images/placeholder.png"}
                                                alt={product.name}
                                                style={{
                                                    width: "400px",
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <motion.div
                                                className="absolute top-2 right-2 flex flex-col gap-2"
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={hoveredProduct === product.id ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <Button
                                                    shape="circle"
                                                    icon={<HeartOutlined style={{ color: favorites.includes(product.id) ? "red" : "gray" }} />}
                                                    onClick={() => toggleFavorite(product.id)}
                                                    className="shadow-md bg-white"
                                                />
                                                <Button
                                                    shape="circle"
                                                    icon={<ShoppingCartOutlined style={{ color: "blue" }} />}
                                                    onClick={() => addToCart(product.id)}
                                                    className="shadow-md bg-white"
                                                />
                                            </motion.div>
                                        </div>

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
                                        <p className="text-lg font-semibold text-red-500">
                                            {product.discount > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-500">
                                                        {product.default_price}
                                                    </span>{" "}
                                                    {Number(product.discount_price).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </>
                                            ) : (
                                                <>{product.default_price}</>
                                            )}
                                        </p>
                                        <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline">
                                            View Details
                                        </Link>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <div className="flex justify-center mt-6">
                            <Pagination current={currentPage} pageSize={pageSize} total={filteredProducts.length} onChange={handlePageChange} showSizeChanger={false} />
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default ProductsPage;
