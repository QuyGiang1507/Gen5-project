import React, { useCallback, useRef, useState, useMemo, useEffect } from "react";
import request from "../../api/request";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pagination from "../../components/Pagination/Pagination";
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import './listProduct.css';

const MAX_ITEMS_PER_PAGE = 12;

export default function ListProduct() {
    const [productData, setProductData] = useState({
        status: "idle",
        data: null,
    });

    const [urlSearchParams, setUrlSearchParams] = useSearchParams()
    const [activePage, setActivePage] = useState(() => {
        const activePage = urlSearchParams.get('activePage')
        return activePage ? +activePage : 1;
    });

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const fetchProducts = useCallback(async () => {
        try {
            setProductData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/product", {
                params: {
                    limit: MAX_ITEMS_PER_PAGE,
                    skip: (activePage - 1) * MAX_ITEMS_PER_PAGE,
                },
            });
            
            if (res.success) {
                setProductData({
                    status: "success",
                    data: {
                        products: res.data.data,
                        total: res.data.total,
                    },
                });
            } else {
                setProductData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setProductData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [activePage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const isFirstRender = useRef(false);

    useEffect(() => {
        isFirstRender.current = true;
    }, []);

    useEffect(() => {
        if (!isFirstRender.current) {
            setUrlSearchParams({ activePage })
        } else {
            isFirstRender.current = false;
        }
    }, [activePage]);

    const maxPage = useMemo(() => {
        return productData?.data?.total
            ? Math.ceil(productData?.data?.total / MAX_ITEMS_PER_PAGE)
            : 0;
    }, [productData?.data?.total]);
    

    const handleChangePage = (newActivePage) => {
        setActivePage(newActivePage);
    };
    
    const renderProducts = () => {
        const isLoading =
            productData.status === "idle" || productData.status === "loading";
        const isError = productData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }

        return (
            <div>
                <Container fluid style={{marginTop: "24px", padding: "", backgroundColor: "#ffffff"}}>
                    <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "start", alignItems: "center", padding: "0 15px", height: "100%", flexDirection: "wrap"}}>
                        {productData.data.products.map((product) => (
                            <Col md={3} sm={6} xs={12} style={{padding: "20px 10px"}} key={product._id}>
                                <div style={{}} className="list-product-item">
                                    <Link to={`/product/${product._id}`} style={{color: "black", backgroundColor: "transparent"}}>
                                        <img width="100%" height="160px" style={{borderBottom: "1px solid #ebe9eb", objectFit: "cover"}} src={product.iconUrl} alt={product.productName}></img>
                                        <h4 style={{textAlign: "center", fontWeight: "300", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{product.productName}</h4>
                                        <p style={{textAlign: "center", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{VND.format(product.price)}</p>
                                    </Link>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        );
    };
    
    return (
        <div className="listProduct">
            <Header/>
            <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                    <Col md={4} style={{maxHeight: "100%", margin: "auto"}}>
                        <h3 style={{color: "#34a853", textAlign: "center", fontWeight: "700", fontSize: "2rem", margin: "0"}}>SẢN PHẨM</h3>
                    </Col>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                </Row>
            </Container>
            <Container>
            <div className="listProduct-content">{renderProducts()}</div>
            <div className="listProduct-pagination">
                <Pagination
                    activePage={activePage}
                    handleChangePage={handleChangePage}
                    maxPage={maxPage}
                />
            </div>
            </Container>
            <Footer/>
        </div>
    );
}