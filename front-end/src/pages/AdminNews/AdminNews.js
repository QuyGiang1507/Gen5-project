import React, { useCallback, useRef, useState, useMemo, useEffect } from "react";
import request from "../../api/request";
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { Gear, Trash, ChevronExpand, ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Pagination from "../../components/Pagination/Pagination";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './adminNews.css';

const MAX_ITEMS_PER_PAGE = 10;

export default function AdminNews() {
    const[isHidden, setIsHidden] = useState("isHidden");

    const showSuccess = () => {
        setIsHidden("");
        setTimeout(function () {
            setIsHidden("isHidden")
        }, 5000);
    }

    const handleDeleteNews = async (newsId) => {
        try {
            const res = await request.put(`/api/news/delete/${newsId}`)

            if (res.success) {
                showSuccess();
                fetchNews();
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    const sortTypes = {
        up: {
            type: "sort-up",
            icon: <ChevronUp/>,
        },
        down: {
            type: "sort-down",
            icon: <ChevronDown/>,
        },
        default: {
            type: "sort-default",
            icon: <ChevronExpand/>,
        }
    }

    const [sortName, setSortName] = useState(sortTypes.default);

    const [filter, setFilter] = useState({
        keyword: "",
        sortField: "", 
        sortDirection: "",
    })

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
                    keyword: filter.keyword,
                    sortField: filter.sortField, 
                    sortDirection: filter.sortDirection,
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
    }, [activePage, filter]);

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

    const handleSearch = (keyword) => {
        setFilter({
            ...filter,
            keyword,
        })
    }

    const onChangeSortName = () => {
        if (sortName.type === "sort-default" || "sort-up") {
            setSortName(sortTypes.down);
            setFilter({
                ...filter,
                sortField: "title",
                sortDirection: "asc",
            })
        } 
        if (sortName.type === "sort-down") {
            setSortName(sortTypes.up);
            setFilter({
                ...filter,
                sortField: "title",
                sortDirection: "desc",
            })
        }
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
                <Table striped hover className="mt-4">
                    <thead>
                        <tr>
                            <th style={{textAlign: "center", width: "5%"}}>#</th>
                            <th style={{textAlign: "center", width: "20%"}}>Icon</th>
                            <th style={{textAlign: "center", cursor: "pointer"}}
                                onClick={onChangeSortName}
                                >Tiêu đề {sortName.icon}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsData.data.news.map((item, index) => (
                            <tr key={item._id} style={{height: "60px", lineHeight: "60px", minHeight: "60px", maxHeight: "60px", width: "auto"}}>
                                <td style={{textAlign: "center"}}>{index + 1}</td>
                                <td style={{textAlign: "center"}}>
                                    <img
                                        className="admin-list-news-img"
                                        src={item.iconUrl}
                                        alt={item.title}
                                    />
                                </td>
                                <td>{item.title}</td>
                                <td style={{textAlign: "center", width: "10%"}}>
                                    <Link style={{color: "black"}} to={`/admin/update-news/${item._id}`}>
                                        <Gear className="mx-2" style={{cursor: "pointer"}}/>
                                    </Link>
                                    <Trash 
                                        className="mx-2" 
                                        style={{cursor: "pointer"}} 
                                        onClick={()=> handleDeleteNews(item._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };
    
    return (
        <div className="ListNews">
            <Header/>
            <Container fluid>
                <Row style={{width: "100%"}}>
                    <Col md={2} className="mt-4">
                        <Sidebar activePage={"second"}/>
                    </Col>
                    <Col md={10} sm={12} xs={12}>
                        <h3 className="mt-4">Danh sách tin tức</h3>
                        <div style={{display: "flex", width: "100%", justifyContent: "end", marginBottom: "12px"}}>
                            <Button 
                                variant="primary"
                                as={Link} to="/admin/add-news"
                            >Thêm tin tức</Button>
                        </div>
                        <div>
                            <form className="admin-news-list-query">
                                <div>
                                    <label className="admin-news-list-label">Tìm kiếm:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="listNews-content">{renderNews()}</div>
                        <div className="listNews-pagination">
                            <Pagination
                                activePage={activePage}
                                handleChangePage={handleChangePage}
                                maxPage={maxPage}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Alert variant="primary" className={isHidden} style={{position: "absolute", top: "10px", right: "0", width: "200px", padding: "8px 16px", zIndex: "9999"}}>Lưu thành công!</Alert>
        </div>
    );
}