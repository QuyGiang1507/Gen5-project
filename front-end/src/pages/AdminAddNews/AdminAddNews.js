import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import request from "../../api/request";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Camera } from 'react-bootstrap-icons';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './adminAddNews.css';

export default function AdminAddNews() {
    const navigate = useNavigate();
    const [ disabled, setDisabled ] = useState(true);
    const [src, setSrc] = useState();
    const [content, setContent] = useState();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange"
    });

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
        const { title, iconUrl, sapo, properties } = values;
        if (values.iconUrl) {
            try {
                const res = await request({
                    url: '/api/news',
                    method: 'POST',
                    data: {
                        title,
                        iconUrl,
                        sapo,
                        content: content,
                        properties,
                    }
                })
                
                if (res.success) {
                    navigate("/admin/news");
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
                            className="add-news__container"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Row style={{width: "100%"}}>
                                <h3 className="mt-4">Thêm tin tức</h3>
                            </Row>
                            <Row style={{alignItems: "start", width: "100%", minHeight: "160px", marginTop: "32px"}}>
                                <Col md={3} sm={4} xs={12} style={{minHeight: "160px"}}>
                                    <label htmlFor="news-photo-upload" className="news-img-label">
                                        <div className="news-img-wrap news-img-upload" >
                                            <img htmlFor="news-photo-upload" className="news-img" src={src} alt={src}/>
                                        </div>
                                        <Camera className="news-photo-upload-icon"/>
                                        <input
                                            id="news-photo-upload"
                                            type="file"
                                            className="news-img-input"
                                            onChange={onChangeFile}
                                        /> 
                                    </label>
                                </Col>
                                <Col md={4} sm={4} xs={12} className="add-news-name-col">
                                    <div className="add-news-class">
                                        <input
                                            value="home-news"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-news-class-label">Tin tức trang chủ</label>
                                    </div>
                                    <div className="add-news-class">
                                        <input
                                            value="detail-news"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-news-class-label">Tin tức chi tiết</label>
                                    </div>
                                    <div className="add-news-class">
                                        <input
                                            value="fixed-news"
                                            type="checkbox" 
                                            style={{}}
                                            {...register('properties')}
                                        ></input>
                                        <label style={{marginLeft: "8px"}} className="add-news-class-label">Bài viết cố định</label>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{display: "flex", alignnewss: "center", width: "100%", marginTop: "16px", padding: "0 12px"}}>
                                <label>Tiêu đề:</label>
                                <input
                                    type="text" 
                                    className="add-news__input"
                                    {...register('title', {required: true, max: 120})}
                                />
                            </Row>
                            {errors?.title?.type === 'required' && <p role="alert" style={{color: "red"}}>Tiêu đề không được bỏ trống</p>}
                            {errors?.title?.type === 'max' && <p role="alert" style={{color: "red"}}>Tối đa 120 ký tự</p>}

                            <Row style={{display: "flex", alignnewss: "center", width: "100%", marginTop: "16px", padding: "0 12px"}}>
                                <label>Mô tả:</label>
                                <input
                                    type="text" 
                                    className="add-news__input"
                                    {...register('sapo', {required: true, max: 256})}
                                />
                            </Row>
                            {errors?.sapo?.type === 'required' && <p role="alert" style={{color: "red"}}>Mô tả không được bỏ trống</p>}
                            {errors?.sapo?.type === 'max' && <p role="alert" style={{color: "red"}}>Tối đa 256 ký tự</p>}

                            <Row style={{display: "flex", alignnewss: "center", width: "100%", marginTop: "16px", padding: "0 12px"}}>
                                <label>Nội dung:</label>
                                <CKEditor
                                    style={{width: "100%"}}
                                    editor={ ClassicEditor }
                                    data="<p></p>"
                                    onReady={ editor => {
                                        // You can store the "editor" and use when it is needed.
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        setContent(data)
                                    } }
                                    onBlur={ ( event, editor ) => {
                                    } }
                                    onFocus={ ( event, editor ) => {
                                    } }
                                />
                            </Row>

                            <Row style={{display: "flex", alignnewss: "center", justifyContent: "center", width: "100%", marginTop: "32px"}}>
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