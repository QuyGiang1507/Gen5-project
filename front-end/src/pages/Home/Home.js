import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import request from '../../api/request';
import Carousel from 'react-bootstrap/Carousel';
import './home.css';

export default function Home () {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const [homeSlideData, setHomeSlideData] = useState({
        status: "idle",
        data: null,
    });

    const [homeDiscountData, setHomeDiscountData] = useState({
        status: "idle",
        data: null,
    });

    const [homeOutstandingData, setHomeOutstandingData] = useState({
        status: "idle",
        data: null,
    });

    const [homeNewsData, setHomeNewsData] = useState({
        status: "idle",
        data: null,
    });

    const fetchHomeSlide = useCallback(async () => {
        try {
            setHomeSlideData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/product", {
                params: {
                    property: "home-slide",
                    limit: 5,
                },
            });
            
            if (res.success) {
                setHomeSlideData({
                    status: "success",
                    data: res.data.data,
                });
            } else {
                setHomeSlideData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setHomeSlideData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [])

    const fetchHomeDiscount = useCallback(async () => {
        try {
            setHomeDiscountData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/product", {
                params: {
                    property: "home-discount",
                    limit: 4,
                },
            });
            
            if (res.success) {
                setHomeDiscountData({
                    status: "success",
                    data: res.data.data,
                });
            } else {
                setHomeDiscountData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setHomeDiscountData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [])

    const fetchHomeOutstanding = useCallback(async () => {
        try {
            setHomeOutstandingData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/product", {
                params: {
                    property: "home-outstanding",
                    limit: 4,
                },
            });
            
            if (res.success) {
                setHomeOutstandingData({
                    status: "success",
                    data: res.data.data,
                });
            } else {
                setHomeOutstandingData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setHomeOutstandingData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [])

    const fetchHomeNews = useCallback(async () => {
        try {
            setHomeNewsData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/news", {
                params: {
                    property: "home-news",
                    limit: 4,
                },
            });
            
            if (res.success) {
                setHomeNewsData({
                    status: "success",
                    data: res.data.data,
                });
            } else {
                setHomeNewsData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setHomeNewsData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [])

    useEffect(() => {
        fetchHomeSlide();
    }, [fetchHomeSlide]);

    useEffect(() => {
        fetchHomeDiscount();
    }, [fetchHomeDiscount]);

    useEffect(() => {
        fetchHomeOutstanding();
    }, [fetchHomeOutstanding]);

    useEffect(() => {
        fetchHomeNews();
    }, [fetchHomeNews]);

    const renderHomeSlide = () => {
        const isLoading =
            homeSlideData.status === "idle" || homeSlideData.status === "loading";
        const isError = homeSlideData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }

        return (
            <Carousel activeIndex={index} onSelect={handleSelect}>
                {homeSlideData.data.map((item) => (
                    <Carousel.Item className="home-carousel-item" key={item._id}>
                        <img
                            style={{marginBottom: "", maxHeight: "360px", objectFit: "cover", backgroundColor: "#ffffff", border: "1px solid #ccc", borderRadius: "3px", width: "60%", height: "100%"}}
                            className="d-block"
                            src={item.iconUrl}
                            alt={item.productName}
                        />
                        <Carousel.Caption style={{color: "black"}} className="home-carousel-caption">
                            <p className="home__slide">{item.productName}</p>
                            <p className="home__slide">{VND.format(item.price)}</p>
                            <p className="home__slide-description">{item.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        )
    }

    const renderHomeDiscount = () => {
        const isLoading =
            homeDiscountData.status === "idle" || homeDiscountData.status === "loading";
        const isError = homeDiscountData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }

        return (
            <div>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    {homeDiscountData.data.map((item) => (
                        <Col md={3} sm={6} xs={12} style={{padding: "0 10px", }} key={item._id}>
                            <div style={{border: "1px solid #ebe9eb", width: "100%"}}>
                                <Link to={`product/${item._id}`} style={{color: "black", backgroundColor: "transparent"}}>
                                    <img width="100%" height="160px" style={{borderBottom: "1px solid #ebe9eb", objectFit: "cover"}} src={item.iconUrl} alt={item.productName}></img>
                                    <h4 style={{textAlign: "center", fontWeight: "300", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "4px 4px"}}>{item.productName}</h4>
                                    <p style={{textAlign: "center", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{VND.format(item.price)}</p>
                                </Link>
                                <Link to={`product/${item._id}`} style={{display: "block",width: "100%", padding: "10px 0", textAlign: "center", backgroundColor: "#f04a32", color: "#ffffff", fontWeight: "500", fontSize: "1.25rem"}}>Mua hàng</Link>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        )
    }

    const renderHomeOutstanding = () => {
        const isLoading =
            homeOutstandingData.status === "idle" || homeOutstandingData.status === "loading";
        const isError = homeOutstandingData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }

        return (
            <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                {homeOutstandingData.data.map((item) => (
                    <Col md={3} sm={6} xs={12} style={{padding: "0 10px", }} key={item._id}>
                        <div style={{border: "1px solid #ebe9eb", width: "100%"}}>
                            <Link to={`product/${item._id}`} style={{color: "black", backgroundColor: "transparent"}}>
                                <img width="100%" height="160px" style={{borderBottom: "1px solid #ebe9eb", objectFit: "cover"}} src={item.iconUrl} alt={item.productName}></img>
                                <h4 style={{textAlign: "center", fontWeight: "300", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "4px 4px"}}>{item.productName}</h4>
                                <p style={{textAlign: "center", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{VND.format(item.price)}</p>
                            </Link>
                            <Link to={`product/${item._id}`} style={{display: "block",width: "100%", padding: "10px 0", textAlign: "center", backgroundColor: "#f04a32", color: "#ffffff", fontWeight: "500", fontSize: "1.25rem"}}>Mua hàng</Link>
                        </div>
                    </Col>
                ))}
            </Row>
        )
    }

    const renderHomeNews = () => {
        const isLoading =
            homeNewsData.status === "idle" || homeNewsData.status === "loading";
        const isError = homeNewsData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }
        
        return (
            <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", minHeight: "100%"}}>
                {homeNewsData.data.map((item) => (
                    <Col md={3} sm={6} xs={12} style={{padding: "0 10px", minHeight: "100%"}} key={item._id}>
                        <div style={{border: "1px solid #ebe9eb", width: "100%", minHeight: "100%"}}>
                            <Link to={`news/${item._id}`} style={{color: "black", backgroundColor: "transparent"}}>
                                <img width="100%" height="160px" style={{borderBottom: "1px solid #ebe9eb", objectFit: "cover"}} src={item.iconUrl} alt={item.title}></img>
                                <h4 style={{textAlign: "center", color: "#34a853", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "4px 4px"}}>{item.title}</h4>
                                <p style={{textAlign: "start", padding: "0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{item.sapo}</p>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        )
    }

    return (
        <div>
            <Header/>

            <Container fluid style={{marginTop: "", padding: "", backgroundColor: "#64fa8c"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%"}}>
                    <Col md={12} style={{maxHeight: "100%", background: "#64fa8c", boxShadow: "", margin: "auto", padding: "16px 16px"}}>
                        {renderHomeSlide()}
                    </Col>
                </Row>
            </Container>

            <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    <Col md={3}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                    <Col md={6} style={{maxHeight: "100%", margin: "auto"}}>
                        <h3 style={{color: "#34a853", textAlign: "center", fontWeight: "700", fontSize: "2rem", margin: "0"}}>ƯU ĐÃI DÀNH CHO BẠN</h3>
                    </Col>
                    <Col md={3}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                </Row>
            </Container>

            <Container fluid style={{padding: "10px 0", backgroundColor: "#ffffff"}}>
                {renderHomeDiscount()}
            </Container>

            <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                    <Col md={4} style={{maxHeight: "100%", margin: "auto"}}>
                        <h3 style={{color: "#34a853", textAlign: "center", fontWeight: "700", fontSize: "2rem", margin: "0"}}>SẢN PHẨM NỔI BẬT</h3>
                    </Col>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                </Row>
            </Container>

            <Container fluid style={{padding: "10px 0", backgroundColor: "#ffffff"}}>
                {renderHomeOutstanding()}
            </Container>

            <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                    <Col md={4} style={{maxHeight: "100%", margin: "auto"}}>
                        <h3 style={{color: "#34a853", textAlign: "center", fontWeight: "700", fontSize: "2rem", margin: "0"}}>TIN TỨC MỚI</h3>
                    </Col>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                </Row>
            </Container>

            <Container fluid style={{padding: "10px 0", backgroundColor: "#ffffff", minHeight: "360px"}}>
                {renderHomeNews()}
            </Container>

            <Footer/>
        </div>
    )
}