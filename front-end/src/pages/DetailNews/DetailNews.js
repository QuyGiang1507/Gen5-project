import React, { useCallback, useEffect, useState } from 'react';
import request from "../../api/request";
import { useParams } from "react-router-dom";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container, Row } from 'react-bootstrap';
import parse from 'html-react-parser';
import './detailNews.css';

export default function DetailNews() {
    const { newsId } = useParams();
    
    const [newsData, setNewsData] = useState({
        status: "idle",
        data: null,
    });

    const fetchNews = useCallback(async () => {
        try {
            setNewsData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get(`/api/news/${newsId}`);
            
            if (res.success) {
                setNewsData({
                    status: "success",
                    data: {
                        news: res.data,
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
    }, [newsId]);
    useEffect(() => {
        fetchNews()
    }, [fetchNews]);
    
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

        return(
            <div>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%", marginBottom: "16px"}}>
                    <h1>{newsData.data.news.title}</h1>
                </Row>

                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%", marginBottom: "16px"}}>
                    <p><b>{newsData.data.news.sapo}</b></p>
                </Row>

                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%", marginBottom: "16px"}}>
                    {parse(newsData.data.news.content)}
                </Row>
            </div>
        )
    };
    return(
        <div>
            <Header/>

            <Container fluid style={{marginTop: "24px", padding: "", backgroundColor: "#ffffff"}}>
                {renderNews()}
            </Container>

            <Footer/>
        </div>
    )
}