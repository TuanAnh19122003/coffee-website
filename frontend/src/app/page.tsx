"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Layout, Card, Col, Row, Image, Typography, Button, message, Spin, Empty, Carousel } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
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

    fetchPopularProducts();
  }, []);

  return (
    <Layout className="p-4 mt-16">
      {/* Quảng cáo hình ảnh chạy ngang */}
      <Content className="p-4">
        <div className="hero-banner" style={{ textAlign: 'center', padding: '60px 0', background: '#f7f7f7' }}>
          <Carousel autoplay autoplaySpeed={4000}>
            <div>
              <Image src="/banner1.jpg" alt="Banner 1" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </div>
            <div>
              <Image src="/banner2.jpg" alt="Banner 2" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </div>
            <div>
              <Image src="/banner3.jpg" alt="Banner 3" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </div>
          </Carousel>
        </div>


        {/* Sản phẩm nổi bật */}
        <Title level={2} className="text-center mb-6">
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
              <Empty description="Chưa có sản phẩm phổ biến" />
            )}
          </Row>
        )}
      </Content>

      {/* Bài viết giới thiệu */}
      <div className="featured-section" style={{ background: '#fff', padding: '40px 0' }}>
        <Title level={2} className="text-center mb-6">
          Tại Sao Chọn Chúng Tôi?
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Title level={4}>Không Gian Thư Giãn</Title>
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <Image
                  src="/space.jpg"
                  alt="Không gian thư giãn"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
              <Paragraph>
                Đến với chúng tôi để tận hưởng không gian thư giãn thoải mái, lý tưởng cho mọi cuộc hẹn.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Title level={4}>Cà Phê Đặc Biệt</Title>
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <Image
                  src="/coffee.jpg"
                  alt="Cà phê đặc biệt"
                  style={{
                    width: '500px',
                    height: '300px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
              <Paragraph>
                Những tách cà phê chất lượng, đậm đà hương vị từ những hạt cà phê nguyên chất.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Title level={4}>Dịch Vụ Tận Tâm</Title>
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <Image
                  src="/service.jpg"
                  alt="Dịch vụ tận tâm"
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
              <Paragraph>
                Đội ngũ nhân viên luôn sẵn sàng phục vụ bạn một cách chuyên nghiệp và thân thiện.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Liên hệ với chúng tôi (Thay đổi thành "Khám Phá Cửa Hàng") */}
      <div style={{ marginTop: '50px' }}>
        <Title level={2} className="text-center">
          Khám Phá Cửa Hàng
        </Title>
        <div
          style={{
            background: `url('/shop-background.jpg') no-repeat center center`,
            backgroundSize: 'cover',
            height: '200px',
            padding: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Button
            type="primary"
            onClick={() => window.location.href = '/products'}
            icon={<CoffeeOutlined />}
            size="large"
            style={{
              width: '200px',
              height: '50px',
              fontSize: '18px',
            }}
          >
            Khám Phá Cửa Hàng
          </Button>
        </div>
      </div>


    </Layout>
  );
};

export default HomePage;
