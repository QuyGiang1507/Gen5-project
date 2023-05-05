import React, { useCallback, useRef, useState, useMemo, useEffect } from "react";
import request from "../../api/request";
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { Gear, Trash, ChevronExpand, ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import Pagination from "../../components/Pagination/Pagination";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import DatePicker from 'react-date-picker';
import './adminListItems.css';

const MAX_ITEMS_PER_PAGE = 10;

export default function AdminListItems() {

    const [dateStart, setDateStart] = useState(new Date("2000-01-01"));
    const [dateEnd, setDateEnd] = useState(new Date("2100-01-01"));

    const [productData, setProductData] = useState({
        status: "idle",
        data: null,
    });

    const [filter, setFilter] = useState({
        keyword: "",
        sortField: "", 
        sortDirection: "",
        tag: "",
        expStart: new Date(dateStart),
        expEnd: new Date(dateEnd),
    });

    const handleSearch = (keyword) => {
        setFilter({
            ...filter,
            keyword,
        })
    }

    const handleFilterTag = (tag) => {
        setFilter({
            ...filter,
            tag,
        })
    }

    const handleFilterExp = () => {
        setFilter({
            ...filter,
            expStart: new Date(dateStart),
            expEnd: new Date(dateEnd),
        })
    }

    useEffect(() => {
        handleFilterExp();
    }, [dateStart, dateEnd]);

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
                    keyword: filter.keyword,
                    sortField: filter.sortField, 
                    sortDirection: filter.sortDirection,
                    tag: filter.tag,
                    expStart: filter.expStart,
                    expEnd: filter.expEnd,
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
    }, [activePage, filter]);

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
    const [sortQuantity, setSortQuantity] = useState(sortTypes.default);
    const [sortPrice, setSortPrice] = useState(sortTypes.default);
    const [sortExp, setSortExp] = useState(sortTypes.default);

    const onChangeSortName = () => {
            if (sortName.type === "sort-default" || "sort-up") {
                setSortName(sortTypes.down);
                setFilter({
                    ...filter,
                    sortField: "productName", 
                    sortDirection: "desc",
                })
            } 
            if (sortName.type === "sort-down") {
                setSortName(sortTypes.up);
                setFilter({
                    ...filter,
                    sortField: "productName", 
                    sortDirection: "asc",
                })
            }
    };
    
    const onChangeSortQuantity = () => {
            if (sortQuantity.type === "sort-default" || "sort-up") {
                setSortQuantity(sortTypes.down);
                setFilter({
                    ...filter,
                    sortField: "amount", 
                    sortDirection: "desc",
                })
            } 
            if (sortQuantity.type === "sort-down") {
                setSortQuantity(sortTypes.up);
                setFilter({
                    ...filter,
                    sortField: "amount", 
                    sortDirection: "asc",
                })
            }
    };
    
    const onChangeSortPrice = () => {
            if (sortPrice.type === "sort-default" || "sort-up") {
                setSortPrice(sortTypes.down);
                setFilter({
                    ...filter,
                    sortField: "price", 
                    sortDirection: "desc",
                })
            } 
            if (sortPrice.type === "sort-down") {
                setSortPrice(sortTypes.up);
                setFilter({
                    ...filter,
                    sortField: "price", 
                    sortDirection: "asc",
                })
            }
    };
    
    const onChangeSortExp = () => {
            if (sortExp.type === "sort-default" || "sort-up") {
                setSortExp(sortTypes.down);
                setFilter({
                    ...filter,
                    sortField: "exp", 
                    sortDirection: "desc",
                })
            } 
            if (sortExp.type === "sort-down") {
                setSortExp(sortTypes.up);
                setFilter({
                    ...filter,
                    sortField: "exp", 
                    sortDirection: "asc",
                })
            }
    };

    const[isHidden, setIsHidden] = useState("isHidden");

    const showSuccess = () => {
        setIsHidden("");
        setTimeout(function () {
            setIsHidden("isHidden")
        }, 5000);
    }

    const handleDeleteItem = async (productId) => {
        try {
            const res = await request.put(`/api/product/detete/${productId}`)

            if (res.success) {
                showSuccess();
                fetchProducts();
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

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
                    <Table striped hover className="mt-4">
                        <thead>
                            <tr>
                                <th style={{textAlign: "center"}}>#</th>
                                <th style={{textAlign: "center"}}>Ảnh</th>
                                <th style={{textAlign: "center", cursor: "pointer"}} colSpan={2}
                                    onClick={onChangeSortName}
                                    >Tên voucher {sortName.icon}
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}
                                    onClick={onChangeSortQuantity}
                                    >Số lượng {sortQuantity.icon}
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}
                                    onClick={onChangeSortPrice}
                                    >Giá {sortPrice.icon}
                                </th>
                                <th style={{textAlign: "center", cursor: "pointer"}}
                                    onClick={onChangeSortExp}
                                    >Hạn sử dụng {sortExp.icon}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.data.products.map((product, index) => (
                                <tr key={product._id}>
                                    <td style={{textAlign: "center"}}>{index + 1}</td>
                                    <td style={{textAlign: "center"}}>
                                        <img
                                            className="admin-list-item-img"
                                            src={product.iconUrl}
                                            alt={product.productName}
                                        />
                                    </td>
                                    <td colSpan={2}>{product.productName}</td>
                                    <td style={{textAlign: "center"}}>{new Intl.NumberFormat().format(product.amount)}</td>
                                    <td style={{textAlign: "center"}}>{VND.format(product.price)}</td>
                                    <td style={{textAlign: "center"}}>{new Date(product.exp).getDate()}/{new Date(product.exp).getMonth() + 1}/{new Date(product.exp).getFullYear()}</td>
                                    <td style={{textAlign: "end"}}>
                                        <Link style={{color: "black"}} to={`/admin/update-product/${product._id}`}>
                                            <Gear className="mx-2" style={{cursor: "pointer"}}/>
                                        </Link>
                                        <Trash 
                                            className="mx-2" style={{cursor: "pointer"}}
                                            onClick={() => handleDeleteItem(product._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    };
    
    return (
        <div className="listProduct">
            <Header/>
            <Container fluid>
                <Row style={{width: "100%"}}>
                    <Col md={2} className="mt-4">
                        <Sidebar activePage={"first"}/>
                    </Col>
                    <Col md={10} sm={12} xs={12}>
                        <h3 className="mt-4">Danh sách sản phẩm</h3>
                        <div style={{display: "flex", width: "100%", justifyContent: "end", marginBottom: "12px"}}>
                            <Button 
                                variant="primary"
                                as={Link} to="/admin/add-product"
                            >Thêm sản phẩm</Button>
                        </div>
                        <div>
                            <form className="admin-item-list-query">
                                <div>
                                    <label className="admin-item-list-label">Tìm kiếm:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="admin-item-list-label">Thuộc tính:</label>
                                    <select
                                        onChange={(e) => handleFilterTag(e.target.value)}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="christmas">Voucher Noel</option>
                                        <option value="tet">Voucher Tết</option>
                                        <option value="independent-day">Voucher 30/4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="admin-item-list-label">Hạn sử dụng:</label>
                                    <DatePicker onChange={setDateStart} value={dateStart} clearIcon={null}format="dd/MM/yyyy"/>
                                    <DatePicker onChange={setDateEnd} value={dateEnd} clearIcon={null}format="dd/MM/yyyy"/>
                                </div>
                            </form>
                        </div>
                        <div className="listProduct-content">{renderProducts()}</div>
                        <div className="listProduct-pagination">
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