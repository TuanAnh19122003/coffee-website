"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Layout, Card, Col, Row, Image, Typography, Button, Space, message, Spin, Empty } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const AboutUsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/random`);
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.error("Dữ liệu trả về không phải là mảng:", response.data);
                    message.error("Có lỗi khi tải sản phẩm");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                message.error("Có lỗi khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchRandomProducts();
    }, []);


    return (
        <Layout className="p-4 mt-16">
            {/* About Us Content */}
            <Content className="flex-grow p-4">
                {/* Space for Quán giới thiệu */}
                <Title level={1} className="text-center mb-6">
                    Chào Mừng Đến Với Quán Cà Phê Xưởng!
                </Title>
                <Row gutter={[16, 24]} className="mb-6">
                    <Col xs={14} sm={12}>
                        <Image
                            src="/cafe_intro.jpg"
                            alt="Quán cà phê Xưởng"
                            style={{
                                width: '800px',
                                height: '400px',
                                objectFit: 'cover',
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Paragraph>
                            Quán cà phê Xưởng được thiết kế để mang đến không gian thư giãn, hiện đại nhưng vẫn giữ lại nét ấm cúng và lãng mạn. Chúng tôi sử dụng nguyên liệu hảo hạng và cam kết mang đến những tách cà phê chất lượng nhất cho mọi khách hàng.
                        </Paragraph>
                        <Paragraph>
                            Với phong cách thiết kế độc đáo và dịch vụ tận tâm, chúng tôi hy vọng mỗi lần đến quán sẽ là một trải nghiệm đáng nhớ cho bạn.
                        </Paragraph>
                    </Col>
                </Row>


                {/* Các đặc trưng của quán */}
                <Title level={2} className="mb-6 text-center">
                    Các Đặc Trưng Của Quán
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card variant="outlined" hoverable>
                            <Title level={4}>Không Gian Thư Giãn</Title>
                            <Paragraph>
                                Quán của chúng tôi có không gian rộng rãi, thoáng mát, thích hợp cho mọi cuộc hẹn hoặc những giờ thư giãn một mình.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card variant="outlined" hoverable>
                            <Title level={4}>Cà Phê Đặc Sản</Title>
                            <Paragraph>
                                Được chế biến từ những hạt cà phê nguyên chất, chúng tôi luôn mang đến những tách cà phê đậm đà, hương vị tuyệt vời.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card variant="outlined" hoverable>
                            <Title level={4}>Dịch Vụ Tận Tâm</Title>
                            <Paragraph>
                                Đội ngũ nhân viên chuyên nghiệp luôn sẵn sàng phục vụ và mang đến trải nghiệm thoải mái nhất cho khách hàng.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                <Title level={2} className="mb-6 text-center">
                    Các Món Cà Phê Phổ Biến
                </Title>
                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[16, 16]} justify="center">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                index < 4 && (  // Chỉ lấy 4 sản phẩm
                                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                        <Link href={`/products`} passHref>
                                            <Card
                                                hoverable
                                                style={{ height: '100%' }}
                                                cover={
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                                                        alt={product.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '200px',
                                                            objectFit: 'contain',
                                                            objectPosition: 'center',
                                                        }}
                                                    />
                                                }
                                            >
                                                <Title level={4} className="truncate">{product.name}</Title>
                                                <p>{product.category?.name}</p>
                                            </Card>
                                        </Link>
                                    </Col>
                                )
                            ))
                        ) : (
                            <Empty description="No popular products found" />
                        )}
                    </Row>
                )}

                {/* Contact Section */}
                <div style={{ marginTop: '50px' }}>
                    <Title level={2} className="text-center">
                        Liên Hệ Với Chúng Tôi
                    </Title>
                    {/* Nút liên hệ với ảnh nền */}
                    <div
                        style={{
                            background: `url('/background-image.jpg') no-repeat center center`,
                            backgroundSize: 'cover', // Đảm bảo nền sẽ cover toàn bộ không gian
                            height: '200px',
                            padding: '0',
                            display: 'flex',
                            backgroundPosition: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={() => window.location.href = '/feedback'}
                            icon={<CoffeeOutlined />}
                            size="large"
                            style={{
                                width: '200px',
                                height: '50px',
                                fontSize: '18px', // Điều chỉnh kích thước font để nút trông dễ nhìn hơn
                            }}
                        >
                            Gửi Liên Hệ
                        </Button>
                    </div>

                </div>
            </Content>
        </Layout>
    );
};

export default AboutUsPage;
