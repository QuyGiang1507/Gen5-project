import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel, Form, Button, Alert } from 'react-bootstrap';
import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import request from '../../api/request';
import './detailItem.css'

export default function DetailItem() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { productId } = useParams();
    const [ quantity, setQuantity ] = useState(0);

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const incrementQuantity = () => {
        setQuantity(Number(quantity) + 1);
    }

    const decrementQuantity = () => {
        if(quantity > 0)
        setQuantity(Number(quantity) - 1);
    }

    const [ item, setItem ] = useState({
        status: "idle",
        data: null,
    });
    

    const getDetailItem = useCallback(async () => {
        try {
            setItem((...preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get(`/api/product/${productId}`);
            if(res.success) {
                setItem({
                    status: "success",
                    data: res.data,
                })
            } else {
                setItem((preState) => ({
                    ...preState,
                    status: "error",
                }))
            }
        } catch (err) {
            console.log(err);
        }
            
    },[]);

    const[isHidden, setIsHidden] = useState("isHidden");

    const showSuccess = () => {
        setIsHidden("");
        setTimeout(function () {
            setIsHidden("isHidden")
        }, 5000);
    }

    const addItemToCart = async () => {
        if(quantity > 0) {
            try {
                const res = await request({
                    url: '/api/cart',
                    method: 'POST',
                    data: {
                        productId: productId,
                        quantity: quantity,
                    }
                })
    
                if(res.success) {
                    showSuccess();
                }
            } catch (err) {
                console.log(err);
                alert('Sản phẩm đã hết!');
            }
        } else {
            alert('Hãy chọn số lượng muốn mua!');
        }
    }

    const buyItem = async () => {
        if(quantity > 0) {
            try {
                const res = await request({
                    url: '/api/cart',
                    method: 'POST',
                    data: {
                        productId: productId,
                        quantity: quantity,
                    }
                })
                if(res.success) {
                    navigate("/cart");
                }
            } catch (err) {
                alert('Sản phẩm đã hết!');
            }
        } else {
            alert('Hãy chọn số lượng muốn mua!');
        }
    }

    useEffect(() => {
        getDetailItem();
    }, [getDetailItem]);
    
    return (
        <div>
            <Header/>

            {!!item.data ? (
                <div>
                    <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                        <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%", border: "1px solid #ebe9eb", borderShadow: "2px 2px #ebe9eb"}}>
                            <Col md={6} style={{ padding: "16px 16px" }}>
                                <Carousel style={{ border: "1px solid #ebe9eb"}}>
                                    <Carousel.Item key={item.data._id}>
                                    <img
                                        className="d-block w-100"
                                        src={item.data.iconUrl}
                                        alt={item.data.productName}
                                    />
                                    </Carousel.Item>
                                </Carousel>
                            </Col>
                            <Col md={6} style={{ padding: "16px 16px" }}>
                                <h1>{item.data.productName}</h1>
                                <Row>
                                    <Col md={4} sm={4} xs={6}>
                                        <p>Giá: </p>
                                    </Col>
                                    <Col md={8} sm={8} xs={6}>
                                        <p>{VND.format(item.data.price)}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4} sm={4} xs={6}>
                                        <p>Hiệu lực voucher: </p>
                                    </Col>
                                    <Col md={8} sm={8} xs={6}>
                                        <p>{new Date(item.data.exp).getDate()}/{new Date(item.data.exp).getMonth()}/{new Date(item.data.exp).getFullYear()}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4} sm={4} xs={6}>
                                        <p>Mã giảm giá chưa kích hoạt: </p>
                                    </Col>
                                    <Col md={8} sm={8} xs={6}>
                                        <p>{item.data.code}</p>
                                    </Col>
                                </Row>
                                {/*<Row>
                                    <Col md={4} sm={4} xs={6}>
                                        <p>Mô tả: </p>
                                    </Col>
                                    <Col md={8} sm={8} xs={6}>
                                        <p>{item.data.description}</p>
                                    </Col>
                                </Row>*/}
                                <Form>
                                    <Row>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{display: "flex", alignItems: "center"}}>
                                            <Form.Label style={{marginBottom: "0"}}>Số lượng:</Form.Label>
                                            <Button 
                                                style={{backgroundColor: "#fff", border: "1px solid #ced4da", color: "#000", fontSize: "1.25rem", padding: "3px 15px", margin: "0 4px 0 12px"}}
                                                onClick={decrementQuantity}
                                            >-</Button>
                                            <Form.Control 
                                                style={{width: "100px", textAlign: "center"}} 
                                                type="text"
                                                onChange={e => setQuantity(e.target.value)}
                                                value={quantity}
                                            />
                                            <Button 
                                                style={{backgroundColor: "#fff", border: "1px solid #ced4da", color: "#000", fontSize: "1.25rem", padding: "3px 12px", margin: "0 0 0 4px"}}
                                                onClick={incrementQuantity}
                                            >+</Button>
                                        </Form.Group>
                                    </Row>
                                    {(isAuthenticated) ? 
                                        (
                                            <div>
                                                <Button 
                                                    variant="danger" 
                                                    style={{ width: "200px", marginTop: "8px" }}
                                                    onClick={addItemToCart}
                                                >Thêm vào giỏ hàng
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    className="detail-item__buy-btn"
                                                    onClick={buyItem}
                                                >Mua ngay
                                                </Button>
                                            </div>
                                    ): <p></p>}
                                </Form>
                            </Col>
                        </Row>
                    </Container>
    
                    <Container fluid style={{margin: "30px 0", padding: "10px 0", backgroundColor: "#ffffff"}}>
                        <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "15px 15px", height: "100%", border: "1px solid #ebe9eb", borderShadow: "2px 2px #ebe9eb"}}>
                            <h2>Mô tả chi tiết mã giảm giá</h2>
                            <Row style={{ width: "100%", marginTop: "32px"}}>
                                <Col md={4} sm={5} xs={6}>
                                    <p>Mô tả sản phẩm:</p>
                                </Col>
                                <Col md={8} sm={7} xs={6}>
                                    <p style={{ wordWrap: "break-word" }}>{item.data.description}</p>
                                </Col>
                            </Row>
                            <Row style={{ width: "100%" }}>
                                <Col md={4} sm={5} xs={6}>
                                    <p>Mục đích sử dụng của mã giảm giá:</p>
                                </Col>
                                <Col md={8} sm={7} xs={6}>
                                    <p style={{ wordWrap: "break-word" }}>{item.data.uses}</p>
                                </Col>
                            </Row>
                            <Row style={{ width: "100%"}}>
                                <Col md={4} sm={5} xs={6}>
                                    <p>Hướng dẫn sử dụng:</p>
                                </Col>
                                <Col md={8} sm={7} xs={6}>
                                    <p style={{ wordWrap: "break-word" }}>{item.data.guide}</p>
                                </Col>
                            </Row>
                            <Row style={{ width: "100%"}}>
                                <Col md={4} sm={5} xs={6}>
                                    <p>Điều khoản & điều kiện:</p>
                                </Col>
                                <Col md={8} sm={7} xs={6}>
                                    <p style={{ wordWrap: "break-word" }}>{item.data.termsAndConditions}</p>
                                </Col>
                            </Row>
                        </Row>
                    </Container>
                </div>
            ) : (<div>loading</div>)}


            <Footer/>

            <Alert variant="primary" className={isHidden} style={{position: "absolute", top: "10px", right: "0", width: "200px", padding: "8px 16px", zIndex: "9999"}}>Đã thêm sản phẩm vào giỏ!</Alert>
        </div>
    )
}