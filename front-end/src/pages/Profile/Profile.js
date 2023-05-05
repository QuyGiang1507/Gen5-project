import React, {useState, useEffect, useCallback} from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container, Row, Col, Nav, Button, Modal, Alert } from 'react-bootstrap';
import { PersonCircle, Telephone, Envelope, ShieldLock, Camera } from 'react-bootstrap-icons';
import DatePicker from 'react-date-picker';
import request from '../../api/request';
import { useForm } from "react-hook-form";
import useAuth from '../../hooks/useAuth';
import './profile.css';

const nations = ["Chọn quốc tịch", "Việt Nam", "Ả Rập Xê Út", "Afghanistan", "Ai Cập", "Albania", "Algeria", "Ấn Độ", "Andorra", "Angola", "Anh", "Antigua và Barbuda", "Áo", "Argentina", "Armenia", "Azerbaijan", "Ba Lan", "Bắc Macedonia", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belize", "Bénin", "Bhutan", "Bỉ", "Bờ Biển Ngà", "Bồ Đào Nha", "Bolivia", "Bosnia và Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Các tiểu vương quốc Ả Rập Thống nhất", "Cameroon", "Campuchia", "Canada", "Cape Verde", "Chad", "Chile", "Colombia", "Comoros", "Cộng hòa Congo", "Cộng hòa dân chủ Congo", "Cộng hòa Dominican", "Cộng hòa Séc", "Cộng hòa Trung Phi", "Costa Rica", "Croatia", "Cuba", "Djibouti", "Dominica", "Đài Loan", "Đan Mạch", "Đông Timor", "Đức", "Ecuador", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Gabon", "Gambia", "Georgia", "Ghana", "Grenada", "Guatemala", "Guinea", "Guinea Xích đạo", "Guinea-Bissau", "Guyana", "Hà Lan", "Haiti", "Hàn Quốc", "Hoa Kỳ", "Honduras", "Hungary", "Hy Lạp", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Jamaica", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Lào", "Latvia", "Lesotho", "Liban", "Liberia", "Libya", "Liechtenstein", "Liên bang Micronesia", "Lithuania", "Luxembourg", "Ma-rốc", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mông Cổ", "Montenegro", "Mozambique", "Myanmar", "Na Uy", "Nam Phi", "Nam Sudan", "Namibia", "Nauru", "Nepal", "reNew Zealand", "Nga", "Nhật Bản", "Nicaragua", "Niger", "Nigeria", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Phần Lan", "Pháp", "Philippines", "Qatar", "Quần đảo Marshall", "Quần đảo Solomon", "Romania", "Rwanda", "Saint Kitts và Nevis", "Saint Lucia", "Saint Vincent và Grenadines", "Samoa", "San Marino", "São Tomé và Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Síp", "Slovakia", "Slovenia", "Somalia", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Syria", "Tajikistan", "Tanzania", "Tây Ban Nha", "Thái Lan", "Thành Vatican", "Thổ Nhĩ Kỳ", "Thụy Điển", "Thụy Sĩ", "Togo", "Tonga", "Triều Tiên", "Trinidad và Tobago", "Trung Quốc", "Tunisia", "Turkmenistan", "Tuvalu", "Úc", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Ý", "Yemen", "Zambia", "Zimbabwe",]

export default function Profile() {
    const [date, setDate] = useState(new Date());

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isDisabledPhone, setDisabledPhone] = useState(true);

    const enablePhone = () => setDisabledPhone(false);
    const disablePhone = () => setDisabledPhone(true);

    const [ disabled, setDisabled ] = useState(true);
    const [ src, setSrc ] = useState();

    const { user } = useAuth();
    
    const [userData, setUserData] = useState({
        status: "idle",
        data: null,
    });

    const fetchUserInfo = useCallback(async () => {
        try {
            setUserData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get(`/api/auth/me`);
            
            if (res.success) {
                setUserData({
                    status: "success",
                    data: {
                        user: res.data,
                    },
                });
            } else {
                setUserData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setUserData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, []);
    
    useEffect(() => {
        fetchUserInfo()
    }, [fetchUserInfo]);

    useEffect(() => {
        if(userData.status === "success") {
            setSrc(userData.data.user.avatarUrl || "");
            setValue('name', userData.data.user.name || userData.data.user.username);
            setValue('gender', userData.data.user.gender || "");
            setValue('nationality', userData.data.user.nationality || "Chọn quốc tịch");
            setValuePhone('phone', userData.data.user.phone || "");
            setValueEmail('email', userData.data.user.username || "");
            setDate(userData.data.user.birthday ? new Date(userData.data.user.birthday) : new Date());
        }
    }, [userData]);
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            gender: "",
            nationality: "",
        },
        mode: 'onChange',
    });

    const[isHidden, setIsHidden] = useState("isHidden");

    const showSuccess = () => {
        setIsHidden("");
        setTimeout(function () {
            setIsHidden("isHidden")
        }, 5000);
    }

    const onSubmit = async (values) => {
        const { imgUrl, name, gender, nationality } = values;
        
        try {
            const res = await request({
                url: '/api/auth/update-info',
                method: 'put',
                data: {
                    name,
                    birthday: date,
                    gender,
                    nationality,
                    avatarUrl: imgUrl,
                }
            })

            if (res.success) {
                showSuccess();
            }
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const {
        register: registerEmail,
        setValue: setValueEmail,
    } = useForm({
        defaultValues: {
            email: "",
        },
    });

    const {
        register: registerPhone,
        handleSubmit: handleSubmitPhone,
        setValue: setValuePhone,
    } = useForm({
        defaultValues: {
            phone: "",
        },
    });

    const onSubmitPhone = async (values) => {
        const { phone } = values;

        try {
            const res = await request({
                url: '/api/auth/update-info',
                method: 'put',
                data: {
                    phone,
                }
            })

            if (res.success) {
                showSuccess();
                disablePhone();
            }
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const {
        register: registerNewPassword,
        handleSubmit: handleSubmitNewPassword,
        resetField,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            oldpassword: "",
            newpassword: "",
            confirmnewpassword: "",

        },
    });

    const onSubmitNewPassword = async (values) => {
        const { newpassword } = values;

        try {
            const res = await request({
                url: '/api/auth/update-password',
                method: 'put',
                data: {
                    updatePassword: newpassword,
                }
            })

            if (res.success) {
                showSuccess();
                handleClose();
            }
        } catch (err) {
            resetField();
            alert(err.response.data.message);
        }
    };

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
            const imgUrl = await uploadFile(files[0]);
            console.log(imgUrl);
            setValue('imgUrl', imgUrl);
            setSrc(imgUrl);
            imgUrl ? setDisabled(false) : setDisabled(true);
        }
    };

    const [watchName, watchGender, watchNationality, watchPhone] = watch(['name', 'gender', 'nationality', 'phone', 'email']);
    // const [watchPhone] = handleWatchPhone('phone');
    // const [watchEmail] = handleWatchPhone('email');
    
    useEffect(() => {
        setValue('name', watchName);
    }, [watchName]);

    useEffect(() => {
        setValue('gender', watchGender);
    }, [watchGender]);

    useEffect(() => {
        setValue('nationality', watchNationality);
    }, [watchNationality]);

    useEffect(() => {
        setValuePhone('phone', watchPhone);
    }, [watchPhone]);

    return (
        <div>
            <Header/>
            
            <Container fluid style={{background: "#efefef", padding: "28px 0"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "center", alignItems: "center", height: "100%"}}>
                    {/*<Col lg={3} className="profile-sidebar">
                        <Nav className="flex-column">
                            <Nav.Link href="/" className="profile-sidebar-link"><PersonCircle style={{fontSize: "1.6rem", marginRight: "4px"}}/>Username</Nav.Link>
                            <Nav.Link eventKey="link-1" className="profile-sidebar-link">Thông tin tài khoản</Nav.Link>
                            <Nav.Link eventKey="link-2" className="profile-sidebar-link">Thông báo của tôi</Nav.Link>
                            <Nav.Link eventKey="link-3" className="profile-sidebar-link">Quản lý đơn hàng</Nav.Link>
                            <Nav.Link eventKey="link-4" className="profile-sidebar-link">Quản lý đổi trả</Nav.Link>
                            <Nav.Link eventKey="link-5" className="profile-sidebar-link">Sổ địa chỉ</Nav.Link>
                            <Nav.Link eventKey="link-6" className="profile-sidebar-link">Thông tin thanh toán</Nav.Link>
                            <Nav.Link eventKey="link-7" className="profile-sidebar-link">Đánh giá sản phẩm</Nav.Link>
                            <Nav.Link eventKey="link-8" className="profile-sidebar-link">Sản phẩm bạn đã xem</Nav.Link>
                            <Nav.Link eventKey="link-9" className="profile-sidebar-link">Sản phẩm yêu thích</Nav.Link>
                        </Nav>
                    </Col>*/}
                    <Col lg={9} sm={12} xs={12}>
                        <h5>Thông tin tài khoản</h5>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Row style={{width: "100%", backgroundColor: "#ffffff", padding: "16px 0", marginTop: "16px"}}>
                                <Col md={8} sm={8} xs={12} style={{padding: "12px 16px"}}>
                                    <Row style={{alignItems: "center", width: "100%"}}>
                                        <Col md={3} sm={4} xs={12}>
                                            <label htmlFor="photo-upload" className="custom-file-upload">
                                                <div className="img-wrap img-upload" >
                                                    <img htmlFor="photo-upload" className="profile-img-upload" src={src} alt={src}/>
                                                </div>
                                                <Camera className="photo-upload-icon"/>
                                                <input 
                                                    id="photo-upload" 
                                                    type="file"
                                                    onChange={onChangeFile}
                                                /> 
                                            </label>
                                        </Col>
                                        <Col md={9} sm={8} xs={12} className="profile-name-col">
                                            <div className="profile-name">
                                                <label style={{marginRight: "8px"}} className="profile-name-label">Họ & Tên:</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Thêm họ tên"
                                                    name='name'
                                                    style={{width: "60%"}}
                                                    {...register('name')}
                                                ></input>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "32px"}}>
                                        <Col md={3} sm={4} xs={12}>
                                            <label>Ngày sinh:</label>
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

                                    <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "32px"}}>
                                        <Col md={3}>
                                            <label>Giới tính:</label>
                                        </Col>
                                        <Col md={3} style={{padding: "0 0 0 32px"}}>
                                            <input 
                                                type="radio"
                                                value="male"
                                                {...register('gender')}
                                            ></input>
                                            <label style={{marginLeft: "8px"}}>Nam</label>
                                        </Col>
                                        <Col md={3} style={{padding: "0 0 0 32px"}}>
                                            <input 
                                                type="radio"
                                                value="female"
                                                {...register('gender')}
                                            ></input>
                                            <label style={{marginLeft: "8px"}}>Nữ</label>
                                        </Col>
                                        <Col md={3} style={{padding: "0 0 0 32px"}}>
                                            <input 
                                                type="radio"
                                                value="other"
                                                {...register('gender')}
                                            ></input>
                                            <label style={{marginLeft: "8px"}}>Khác</label>
                                        </Col>
                                    </Row>

                                    <Row style={{display: "flex", alignItems: "center", width: "100%", marginTop: "32px"}}>
                                        <Col md={3}>
                                            <label>Quốc tịch:</label>
                                        </Col>
                                        <Col md={9} style={{padding: "0 0 0 32px"}}>
                                            <select 
                                                style={{width: "90%"}}
                                                {...register('nationality')}
                                            >
                                                {nations.map((el) => (
                                                    <option 
                                                        key={el}
                                                        value={el}
                                                    >{el}</option>
                                                ))}
                                            </select>
                                        </Col>
                                    </Row>

                                    <Row style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "32px"}}>
                                        <Col md={4} sm={6} xs={10}>
                                            <Button 
                                                type="submit"
                                                variant="danger"
                                                disabled={disabled}
                                            >Lưu thay đổi</Button>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col md={4} sm={4} xs={12} style={{padding: "12px 16px", borderLeft: "1px solid #ebe9eb"}}>
                                    <Row style={{width: "100%"}}>
                                        <p style={{fontWeight: "bold"}}>Liên hệ:</p>
                                    </Row>
                                    <Row style={{width: "100%", alignItems: "center"}}>
                                        <Col md={2} sm={2} xs={2}>
                                            <Telephone style={{fontSize: "1.25rem", marginBottom: "10px"}}/>
                                        </Col>
                                        <Col md={9} sm={9} xs={9}>
                                            <p>Số điện thoại:</p>
                                            <div onClick={enablePhone} onBlur={handleSubmitPhone(onSubmitPhone)}>
                                                <input 
                                                    type="text"
                                                    disabled={isDisabledPhone}
                                                    {...registerPhone('phone')}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{width: "100%", alignItems: "center"}}>
                                        <Col md={2} sm={2} xs={2}>
                                            <Envelope style={{fontSize: "1.25rem"}}/>
                                        </Col>
                                        <Col md={10} sm={10} xs={10}>
                                            <p>Địa chỉ mail:</p>
                                            <div>
                                                <input 
                                                    type="text"
                                                    disabled={true}
                                                    {...registerEmail('email')}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{width: "100%", marginTop: "32px"}}>
                                        <p style={{fontWeight: "bold"}}>Bảo mật:</p>
                                    </Row>
                                    <Row style={{width: "100%", alignItems: "center"}} onClick={handleShow} className="profile-sidebar-link">
                                        <Col md={2} sm={2} xs={2}>
                                            <ShieldLock style={{fontSize: "1.25rem"}}/>
                                        </Col>
                                        <Col md={10} sm={10} xs={10}><p>Đổi mật khẩu</p></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
                
                
                <Alert variant="primary" className={isHidden} style={{position: "absolute", top: "10px", right: "0", width: "200px", padding: "8px 16px", zIndex: "9999"}}>
                    Lưu thành công!
                </Alert>

                <Modal show={show} onHide={handleClose}>
                    <form onSubmit={handleSubmitNewPassword(onSubmitNewPassword)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Đổi mật khẩu</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px"}}>
                                <label>Mật khẩu cũ:</label>
                                <input 
                                    type="password"
                                    placeholder="Mật khẩu cũ" 
                                    style={{width: "60%"}}
                                    {...registerNewPassword('oldpassword')}
                                ></input>
                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px"}}>
                                <label>Mật khẩu mới:</label>
                                <input 
                                    type="password" 
                                    placeholder="Mật khẩu mới" 
                                    style={{width: "60%"}}
                                    {...registerNewPassword('newpassword', {
                                        minLength: 8
                                    })}
                                ></input>
                            </div>
                            {errors?.newpassword?.type === 'minLength' && <p role="alert" style={{margin: "0 0 0 40%", color: "red"}}>Password ít nhất 8 ký tự</p>}
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px"}}>
                                <label>Nhập lại mật khẩu mới:</label>
                                <input
                                    type="password" 
                                    placeholder="Nhập lại mật khẩu mới" 
                                    style={{width: "60%"}}
                                    {...registerNewPassword('confirmnewpassword', {
                                        validate: () => {
                                            return getValues('newpassword') === getValues('confirmnewpassword')
                                        }
                                    })}
                                ></input>
                                
                            </div>
                            {errors?.confirmnewpassword?.type === 'validate' && <p role="alert" style={{margin: "0 0 0 40%", color: "red"}}>Password không khớp</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button type="submit" variant="primary">
                                Lưu thay đổi
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </Container>
            
            <Footer/>
        </div>
    )
}