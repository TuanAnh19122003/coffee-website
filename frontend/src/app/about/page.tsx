"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Layout, Card, Col, Row, Image, Typography, Button, Space, message, Spin, Empty } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const AboutUsPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Layout className="p-4 mt-16">
            {/* About Us Content */}
            {/* About Us Content */}
            <Content className="flex-grow p-4">
                {/* Chào mừng đến Quán Xưởng Cà Phê */}
                <Title level={1} className="text-center mb-6">
                    Chào Mừng Đến Với Quán Xưởng Cà Phê!
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
                            Quán cà phê Xưởng không chỉ là nơi để thưởng thức những ly cà phê thơm ngon mà còn là một không gian lý tưởng để thư giãn, trò chuyện cùng bạn bè hoặc đơn giản là tìm về một chút yên bình giữa cuộc sống hối hả.
                        </Paragraph>
                        <Paragraph>
                            Được thiết kế với phong cách hiện đại, ấm cúng, quán mang lại một không gian dễ chịu với các khu vực ngồi thoải mái, thích hợp cho mọi nhu cầu – từ một buổi họp mặt bạn bè đến những cuộc trò chuyện riêng tư. Chúng tôi tin rằng mỗi người đến quán sẽ cảm nhận được sự gần gũi và thân thiện, như đang ở chính ngôi nhà của mình.
                        </Paragraph>
                        <Paragraph>
                            Không gian quán được bố trí hợp lý, từ những góc thư giãn nhẹ nhàng cho đến những khu vực sinh hoạt chung năng động. Mỗi chi tiết trong thiết kế đều hướng đến việc tạo ra một môi trường mở, hòa hợp với thiên nhiên, giúp mỗi khách hàng không chỉ thưởng thức cà phê mà còn trải nghiệm sự bình yên trong tâm hồn.
                        </Paragraph>
                        <Paragraph>
                            Đặc biệt, chúng tôi chú trọng đến việc chọn lựa nguyên liệu đầu vào, từ những hạt cà phê nguyên chất, được chọn lọc kỹ lưỡng, đến các sản phẩm đồng hành như bánh ngọt, đồ uống tươi ngon, tất cả đều được chế biến với sự tận tâm và đam mê. Với chúng tôi, cà phê không chỉ là thức uống, mà là một phần trong những khoảnh khắc tuyệt vời mà bạn trải qua mỗi ngày.
                        </Paragraph>
                        <Paragraph>
                            Ngoài cà phê, chúng tôi còn phục vụ các loại đồ uống và món ăn nhẹ khác, mang đến cho bạn một trải nghiệm trọn vẹn. Với đội ngũ nhân viên nhiệt tình và chuyên nghiệp, chúng tôi luôn mong muốn mang lại sự hài lòng và niềm vui cho khách hàng mỗi lần ghé thăm.
                        </Paragraph>
                    </Col>
                </Row>

                {/* Sứ Mệnh và Tầm Nhìn */}
                <div className="featured-section" style={{ background: '#fff', padding: '40px 0' }}>
                    <Title level={2} className="text-center mb-6">
                        Sứ Mệnh và Tầm Nhìn
                    </Title>
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24} sm={8}>
                            <Card hoverable>
                                <Title level={4}>Sứ Mệnh</Title>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <Image
                                        src="/mission.jpg"
                                        alt="Sứ mệnh"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                    />
                                </div>
                                <Paragraph>
                                    Sứ mệnh của chúng tôi là mang lại những trải nghiệm cà phê tuyệt vời, gắn liền với sự tận tâm và chất lượng, giúp khách hàng cảm nhận được sự thư giãn tuyệt đối ngay tại quán.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card hoverable>
                                <Title level={4}>Tầm Nhìn</Title>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <Image
                                        src="/vision.jpg"
                                        alt="Tầm nhìn"
                                        style={{
                                            width: '100%',
                                            height: '235px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                <Paragraph>
                                    Chúng tôi mong muốn trở thành một địa chỉ quen thuộc cho những ai yêu thích cà phê chất lượng và không gian thư giãn, là nơi giúp mỗi người tìm lại sự bình an trong nhịp sống vội vã.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Liên Hệ */}
                <div style={{ marginTop: '50px' }}>
                    <Title level={2} className="text-center">
                        Liên Hệ Với Chúng Tôi
                    </Title>
                    <div
                        style={{
                            background: `url('/background-image.jpg') no-repeat center center`,
                            backgroundSize: 'cover',
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
                                fontSize: '18px',
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
