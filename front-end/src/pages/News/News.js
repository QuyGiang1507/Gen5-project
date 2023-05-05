import React, { useCallback, useRef, useState, useMemo, useEffect } from "react";
import request from "../../api/request";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pagination from "../../components/Pagination/Pagination";
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import './news.css';

const MAX_ITEMS_PER_PAGE = 10;

export default function News() {
    const [newsData, setNewsData] = useState({
        status: "idle",
        data: null,
    });

    const [urlSearchParams, setUrlSearchParams] = useSearchParams()
    const [activePage, setActivePage] = useState(() => {
        const activePage = urlSearchParams.get('activePage')
        return activePage ? +activePage : 1;
    });

    const fetchNews = useCallback(async () => {
        try {
            setNewsData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get("/api/news", {
                params: {
                    property: "detail-news",
                    limit: MAX_ITEMS_PER_PAGE,
                    skip: (activePage - 1) * MAX_ITEMS_PER_PAGE,
                },
            });
            
            if (res.success) {
                setNewsData({
                    status: "success",
                    data: {
                        news: res.data.data,
                        total: res.data.total,
                    },
                });
            } else {
                setNewsData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setNewsData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, [activePage]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

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
        return newsData?.data?.total
            ? Math.ceil(newsData?.data?.total / MAX_ITEMS_PER_PAGE)
            : 0;
    }, [newsData?.data?.total]);
    

    const handleChangePage = (newActivePage) => {
        setActivePage(newActivePage);
    };
    
    const renderNews = () => {
        const isLoading =
            newsData.status === "idle" || newsData.status === "loading";
        const isError = newsData.status === "error";

        if (isLoading) {
            return <div>Loading....</div>;
        }

        if (isError) {
            return <div>Something went wrong</div>;
        }

        return (
            <div>
                <Container fluid style={{marginTop: "24px", padding: "", backgroundColor: "#ffffff"}}>
                    {newsData.data.news.map((item) => (
                        <div className="news-detail-container" key={item._id}>
                            <Link to={`/news/${item._id}`} className="news-detail-link">
                                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", padding: "0 15px", height: "100%", marginBottom: "16px"}}>
                                    <Col lg={3} sm={5} xs={12} style={{alignSelf: "center"}}>
                                        <img width="100%" height="160px" style={{objectFit: "cover"}} src={item.iconUrl} alt={item.iconUrl}></img>
                                    </Col>
                                    <Col lg={9} sm={7} xs={12}>
                                        <h2 style={{textAlign: "justify"}}>{item.title}</h2>
                                        <p style={{textAlign: "justify"}}>{item.sapo}</p>
                                    </Col>
                                </Row>
                            </Link>
                        </div>
                    ))}
                </Container>
            </div>
        );
    };
    
    return (
        <div className="ListNews">
            <Header/>
            <Container fluid style={{marginTop: "30px", padding: "10px 0", backgroundColor: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "center", padding: "0 15px", height: "100%"}}>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                    <Col md={4} style={{maxHeight: "100%", margin: "auto"}}>
                        <h3 style={{color: "#34a853", textAlign: "center", fontWeight: "700", fontSize: "2rem", margin: "0"}}>TIN TỨC MỚI</h3>
                    </Col>
                    <Col md={4}><hr style={{color: "#34a853", height: "2px"}}/></Col>
                </Row>
            </Container>
            <Container>
            <div className="listNews-content">{renderNews()}</div>
            <div className="listNews-pagination">
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