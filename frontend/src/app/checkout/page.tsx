"use client";
import React, { useEffect, useState } from "react";
import { Layout, Table, Typography, Button, Input, message, Radio, Select } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const CheckoutPage = () => {
    const [cart, setCart] = useState<{ id: string; quantity: number; size: string }[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const router = useRouter();

    const getProductPrice = (product: any, size: string) => {
        const selectedSize = product.product_sizes.find((item: any) => item.size === size);
        if (!selectedSize) {
            return 0;
        }

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
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User Data:", userData);
        if (userData.id) {
            setfirstName(userData.firstName || "");
            setlastName(userData.lastName || "");
            setPhone(userData.phone || "");
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
                .then((res) => res.json())
                .then((data) => {
                    const cartProducts = data.products.filter((p: any) => cart.some(item => item.id === p.id));
                    setProducts(cartProducts);
                })
                .catch((error) => console.error("Error fetching cart products:", error));
        }
    }, [cart]);

    const calculateTotalAmount = () => {
        return cart.reduce((total, cartItem) => {
            const product = products.find((p) => p.id === cartItem.id);
            if (!product) return total;
            return total + getProductPrice(product, cartItem.size) * cartItem.quantity;
        }, 0);
    };


    const handlePayment = async () => {
        if (!address.trim()) {
            message.error("Vui lòng nhập địa chỉ!");
            return;
        }
    
        const userId = localStorage.getItem("userId");
    
        const orderData = {
            userId: Number(userId),
            address,
            note,
            orderDetails: cart.map(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                return {
                    productId: Number(cartItem.id),
                    size: cartItem.size,
                    price: getProductPrice(product, cartItem.size),
                    num: cartItem.quantity
                };
            }),
            totalAmount: calculateTotalAmount(),
            status: "PENDING"
        };
    
        console.log("Order Data:", orderData);
    
        try {
            const orderResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, orderData);
            console.log("Order Response:", orderResponse.data);
    
            if (orderResponse.status === 201) {
                const orderId = orderResponse.data.id;
                console.log("Order Id:", orderId); 
    
                message.success("Đơn hàng của bạn đã được đặt thành công!");
                localStorage.removeItem(`cart_${userId}`);
                router.replace("/");
    
            } else {
                message.error("Không thể tạo đơn hàng, vui lòng thử lại!");
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
            console.error(error);
        }
    };    
    
    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
        },
        {
            title: "Size",
            dataIndex: "size",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
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
    ];

    return (
        <Layout className="mx-auto p-4 mt-16">
            <Content className="p-4 flex flex-col md:flex-row gap-6">
                {/* Danh sách sản phẩm */}
                <div className="md:w-2/3">
                    <Title level={2}>Xác nhận đơn hàng</Title>
                    <Table
                        columns={columns}
                        dataSource={products.map((product) => {
                            const cartItem = cart.find((item) => item.id === product.id);
                            if (!cartItem) return { ...product, size: "", quantity: 1, price: 0 };

                            const selectedSize = product.product_sizes.find((size: any) => size.size === cartItem.size);
                            const price = selectedSize ? (selectedSize.discount_price > 0 ? selectedSize.discount_price : selectedSize.price) : 0;

                            return {
                                ...product,
                                size: cartItem.size || "",
                                quantity: cartItem.quantity || 1,
                                price: price * cartItem.quantity
                            };
                        })}
                        rowKey="id"
                        pagination={false}
                    />

                </div>

                {/* Thông tin thanh toán */}
                <div className="md:w-1/3 p-4 border rounded-lg shadow-md">
                    <Title level={3}>Thông tin thanh toán</Title>
                    <div className="mb-4">
                        <p className="font-semibold">Họ tên:</p>
                        <Input value={`${lastName} ${firstName}`} disabled />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Số điện thoại:</p>
                        <Input value={`${phone}`} disabled />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Địa chỉ:</p>
                        <Input placeholder="Nhập địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Ghi chú:</p>
                        <Input.TextArea placeholder="Nhập ghi chú (nếu có)" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Phương thức thanh toán:</p>
                        <Select
                            value={paymentMethod}
                            onChange={(value) => setPaymentMethod(value)}
                            className="w-full"
                        >
                            <Option value="COD">Thanh toán khi nhận hàng (COD)</Option>
                            <Option value="MOMO">Thanh toán qua Momo</Option>
                            <Option value="ZALOPAY">Thanh toán qua ZaloPay</Option>
                        </Select>
                    </div>
                    <div className="text-xl font-semibold">
                        Tổng tiền: {calculateTotalAmount().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </div>

                    <Button type="primary" block onClick={handlePayment}>
                        Thanh toán
                    </Button>
                </div>
            </Content>
        </Layout>
    );
};

export default CheckoutPage;
