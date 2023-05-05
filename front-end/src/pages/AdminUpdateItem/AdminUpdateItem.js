import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Camera } from 'react-bootstrap-icons';
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from 'react-date-picker';
import { useForm } from "react-hook-form";
import request from "../../api/request";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './adminUpdateItem.css';

export default function AdminUpdateItem() {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [ disabled, setDisabled ] = useState(true);
    const [src, setSrc] = useState();
    const [date, setDate] = useState(new Date());
    
    const [productData, setProductData] = useState({
        status: "idle",
        data: null,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange"
    });

    const fetchProduct = useCallback(async () => {
        try {
            setProductData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get(`/api/product/${productId}`);
            
            if (res.success) {
                setProductData({
                    status: "success",
                    data: {
                        product: res.data,
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
    }, [productId]);
    
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct]);

    useEffect(() => {
        if(productData.status === "success") {
            setValue('properties', productData.data.product.properties);
            setValue('tags', productData.data.product.tags);
            setValue('productName', productData.data.product.productName);
            setValue('code', productData.data.product.code);
            setValue('price', productData.data.product.price);
            setValue('amount', productData.data.product.amount);
            setValue('description', productData.data.product.description);
            setValue('uses', productData.data.product.uses);
            setValue('guide', productData.data.product.guide);
            setValue('termsAndConditions', productData.data.product.termsAndConditions);
            setSrc(productData.data.product.iconUrl);
            setDate(new Date(productData.data.product.exp));
            setDisabled(false);
        }
    }, [productData]);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const res = await request({
                url: 'api/upload',
                method: 'POST',
                data: formData,
            });
            return res.data;
        } catch (err) {
            return '';
        }
    }

    const onChangeFile = async e => {
        const files = e.target.files;
        if (files.length) {
            const iconUrl = await uploadFile(files[0]);
            setValue('iconUrl', iconUrl);
            setSrc(iconUrl);
            iconUrl ? setDisabled(false) : setDisabled(true);
        }
    };

    const onSubmit = async values => {
        const { 
            productName,
            iconUrl,
            code,
            price,
            amount,
            description,
            uses,
            guide,
            termsAndConditions,
            properties,
            tags } = values;
        if (values.iconUrl || productData.data.product.iconUrl) {
            try {
                const res = await request({
                    url: `/api/product/${productId}`,
                    method: 'PUT',
                    data: {
                        productName,
                        iconUrl,
                        exp: date,
                        code,
                        price,
                        amount,
                        description,
                        uses,
                        guide,
                        termsAndConditions,
                        properties,
                        tags,
                    }
                })
                
                if (res.success) {
                    navigate("/admin/product");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div>
            <Header/>

            <Container fluid className="mb-4">
                <Row style={{width: "100%"}}>
                    <Col md={2} className="mt-4">
                        <Sidebar/>
                    </Col>
                    <Col md={10}>
                        <form 
                            className="add-item__container"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Row style={{width: "100%"}}>
                                <h3 className="mt-4">Thêm sản phẩm</h3>
                            </Row>
                            <Row style={{alignItems: "center", width: "100%", minHeight: "160px", marginTop: "32px", justifyContent: "space-between"}}>
                                <Col md={3} sm={4} xs={12} style={{minHeight: "160px"}}>
                                    <label htmlFor="item-photo-upload" className="item-img-label">
                                        <div className="item-img-wrap item-img-upload" >
                                            <img htmlFor="item-photo-upload" className="item-img" src={src} alt={src}/>
                                        </div>
                                        <Camera className="item-photo-upload-icon"/>
                                        <input
                                            id="item-photo-upload"
                                            type="file"
                                            className="item-img-input"
                                            onChange={onChangeFile}
                                        /> 
                                    </label>
                                </Col>
                                <Col md={4} sm={4} xs={12}>
                                    <div className="add-item-class">
                                        <input
                                            value="home-outstanding"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Sản phẩm nổi bật</label>
                                    </div>
                                    <div className="add-item-class">
                                        <input
                                            value="home-discount"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Sản phẩm giảm giá</label>
                                    </div>
                                    <div className="add-item-class">
                                        <input
                                            value="home-slide"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Hiển thị slide trang chủ</label>
                                    </div>
                                    <div className="add-item-class">
                                        <input
                                            value="product-detail"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Hiển thị trang sản phẩm</label>
                                    </div>
                                </Col>
                                <Col md={4} sm={4} xs={12}>
                                    <div className="add-item-class">
                                        <input
                                            value="tet"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('tags')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Sản phẩm tết</label>
                                    </div>
                                    <div className="add-item-class">
                                        <input
                                            value="christmas"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('tags')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Sản phẩm giáng sinh</label>
                                    </div>
                                    <div className="add-item-class">
                                        <input
                                            value="independent-day"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('tags')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-item-class-label">Sản phẩm 30/4 - 1/5</label>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Tên sản phẩm:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <input 
                                        type="text" 
                                        className="add-item__input"
                                        {...register('productName', {required: true, max: 120})}
                                    />
                                </Col>
                            </Row>
                            {errors?.productName?.type === 'required' && <p role="alert" style={{color: "red"}}>Tên sản phẩm không được bỏ trống</p>}
                            {errors?.productName?.type === 'max' && <p role="alert" style={{color: "red"}}>Tên sản phẩm không được quá 120 ký tự</p>}

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Hiệu lực sản phẩm:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <DatePicker
                                        name="birthday"
                                        clearIcon={null} 
                                        format="dd/MM/yyyy"
                                        value={date}
                                        onChange={setDate}
                                    />
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Mã code:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <input 
                                        type="text" 
                                        className="add-item__input"
                                        {...register('code', {required: true})}
                                    />
                                </Col>
                            </Row>
                            {errors?.code?.type === 'required' && <p role="alert" style={{color: "red"}}>Mã giảm giá không được bỏ trống</p>}

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Giá tiền:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <input 
                                        type="number" 
                                        className="add-item__input"
                                        {...register('price', {required: true, valueAsNumber: true})}
                                    />
                                </Col>
                            </Row>
                            {errors?.price?.type === 'required' && <p role="alert" style={{color: "red"}}>Giá tiền không được bỏ trống</p>}

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Số lượng:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <input 
                                        type="number" 
                                        className="add-item__input"
                                        {...register('amount', {required: true, valueAsNumber: true})}
                                    />
                                </Col>
                            </Row>
                            {errors?.amount?.type === 'required' && <p role="alert" style={{color: "red"}}>Số lượng không được bỏ trống</p>}

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Mô tả sản phẩm:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <textarea 
                                        type="text" 
                                        className="add-item__input add-item__description" 
                                        rows="2"
                                        {...register('description', {required: true, max: 256})}
                                    ></textarea>
                                </Col>
                            </Row>
                            {errors?.description?.type === 'required' && <p role="alert" style={{color: "red"}}>Mô tả sản phẩn không được bỏ trống</p>}
                            {errors?.description?.type === 'max' && <p role="alert" style={{color: "red"}}>Mô tả sản phẩn không được quá 256 ký tự</p>}

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Mục đích sử dụng:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <textarea 
                                        type="text" 
                                        className="add-item__input add-item__description" 
                                        rows="2"
                                        {...register('uses')}
                                    ></textarea>
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Hướng dẫn sử dụng:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <textarea 
                                        type="text" 
                                        className="add-item__input add-item__description" 
                                        rows="2"
                                        {...register('guide')}
                                    ></textarea>
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={3} sm={4} xs={12}>
                                    <label>Điều kiện & điều khoản:</label>
                                </Col>
                                <Col md={9} sm={7} xs={12} style={{padding: "0 0 0 32px"}}>
                                    <textarea 
                                        type="text" 
                                        className="add-item__input add-item__description" 
                                        rows="2"
                                        {...register('termsAndConditions')}
                                    ></textarea>
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "16px"}}>
                                <Col md={4} sm={6} xs={10}>
                                    <Button style={{width: "100%"}}
                                        type="submit"
                                        variant="danger"
                                        disabled={disabled}
                                    >Lưu thay đổi</Button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}