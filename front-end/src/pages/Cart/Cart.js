import React, {useState, useEffect, useCallback} from 'react';
import { Container, Row, Table, Button, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import request from '../../api/request';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './cart.css';

export default function Cart () {
    const [ cart, setCart ] = useState({
        status: "idle",
        data: null,
    });

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const[isHidden, setIsHidden] = useState("isHidden");

    const showSuccess = () => {
        setIsHidden("");
        setTimeout(function () {
            setIsHidden("isHidden")
        }, 5000);
    }

    const getCart = useCallback(async () => {
        try {
            setCart((...preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get('/api/cart');
            
            if(res.success) {
                setCart({
                    status: "success",
                    data: res.data,
                })
            } else {
                setCart((preState) => ({
                    ...preState,
                    status: "error",
                }))
            }
        } catch (err) {
            setCart((preState) => ({
                ...preState,
                status: "error",
            }))
        }
    },[]);
    useEffect(() => {
        getCart();
    }, [getCart]);
    
    const removeItemFromCart = async (productId) => {
        try {
            const res = await request({
                url: '/api/cart/remove-item',
                method: 'PUT',
                data: { productId: productId }
            })

            if (res.success) {
                showSuccess();
                getCart();
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    const increaseQuantity = async (productId) => {
        try {
            const res = await request({
                url: '/api/cart',
                method: 'PUT',
                data: { 
                    productId: productId, 
                    changeQuantity: 1,
                }
            })
            if (res.success) {
                getCart();
            }
        } catch (err) {
            alert('Sản phẩm đã hết!')
        }
    }

    const decreaseQuantity = async (productId) => {
        try {
            const res = await request({
                url: '/api/cart',
                method: 'PUT',
                data: { 
                    productId: productId, 
                    changeQuantity: -1 
                }
            })

            if (res.success) {
                getCart();
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    const handleBought = async () => {
        try {
            const res = await request.put('/api/cart/buy-product')

            if (res.success) {
                showSuccess();
                getCart();
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }
    
    const renderCart = () => {
        const isLoading =
            cart.status === "idle" || cart.status === "loading";
        const isError = cart.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Chưa có sản phẩm nào trong giỏ! Quay lại trang sản phẩm tại <Link to='/product' style={{color: "blue"}}>đây</Link> để xem hàng hóa</div>;
        }
        
        return (
            <div>
                <Container fluid style={{marginTop: "24px", padding: "", backgroundColor: "#ffffff"}}>
                    <Table className="mt-4" style={{tableLayout: "fixed", width: "100%"}}>
                        <thead>
                            <tr>
                                <th style={{textAlign: "center"}}>#</th>
                                <th style={{textAlign: "center", cursor: "pointer"}} colSpan={2}
                                    >Tên sản phẩm
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}
                                    >Giá
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}>
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}} colSpan={2}
                                    >Số lượng
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}
                                    >Tổng tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.data.items.map((item, index) => (
                                <tr key={item.productId}>
                                    <td style={{textAlign: "center"}}>{index+1}</td>
                                    <td colSpan={2}>{item.productName}</td>
                                    <td style={{textAlign: "center"}}>{VND.format(item.price)}</td>
                                    <td style={{textAlign: "center"}}>x</td>
                                    <td style={{textAlign: "center"}} colSpan={2}
                                    ><Button 
                                        style={{backgroundColor: "#fff", border: "1px solid #ced4da", color: "#000", fontSize: "1rem", padding: "1px 15px", margin: "0 4px 0 12px"}}
                                        onClick={() => decreaseQuantity(item.productId)}
                                    >-</Button>
                                        <input value={item.quantity} type="text" disabled={true} style={{width: "10%", textAlign: "center", fontSize: "1rem", padding: "1px 2px", border: "none"}}/>
                                    <Button 
                                        style={{backgroundColor: "#fff", border: "1px solid #ced4da", color: "#000", fontSize: "1rem", padding: "1px 15px", margin: "0 12px 0 4px"}}
                                        onClick={() => increaseQuantity(item.productId)}
                                    >+</Button>
                                    </td>
                                    <td style={{textAlign: "center"}}>{VND.format(item.total)}</td>
                                    <td style={{textAlign: "center"}}>
                                        <Trash
                                            style={{cursor: "pointer"}}
                                            onClick={() => removeItemFromCart(item.productId)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td style={{textAlign: "center"}}></td>
                                <td style={{textAlign: "center"}} colSpan={2}><b>Tổng tiền</b></td>
                                <td style={{textAlign: "center"}}></td>
                                <td style={{textAlign: "center"}}></td>
                                <td style={{textAlign: "center"}} colSpan={2}></td>
                                <td style={{textAlign: "center"}}><b>{VND.format(cart.data.subTotal)}</b></td>
                                <td style={{textAlign: "center"}}></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    };
    
    return (
        <div>
            <Header/>
            <Container fluid style={{background: "#efefef", padding: "28px 0"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", height: "100%"}}>
                    <h2>Giỏ hàng</h2>
                </Row>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", height: "100%"}}>
                    {renderCart()}   
                </Row>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "center", alignItems: "start", height: "100%"}}>
                    <Button style={{width: "20%", marginTop: "12px"}}
                        type="submit"
                        variant="danger"
                        onClick={handleBought}
                    >Mua hàng</Button>
                </Row>         
            </Container>
            <Alert variant="primary" className={isHidden} style={{position: "absolute", top: "10px", right: "0", width: "200px", padding: "8px 16px", zIndex: "9999"}}>Lưu thành công!</Alert>
            <Footer/>
        </div>
    );
}