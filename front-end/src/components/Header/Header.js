import { Container, Row, Col, Form, InputGroup, Button, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Search, PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import  './header.css'

export default function Header() {
    const { logout, isAuthenticated, user } = useAuth();
    
    return (
        <div>
            <Container fluid style={{padding: "10px 0", height: "90px"}}>
                <Row className="nav__header nav-dropdown__header">
                    <Col md={2} sm={4} xs={8} style={{maxHeight: "100%"}}>
                        <Link to="/">
                            <img  style={{maxHeight: "72px"}} src="https://c3.mediawz.com/wp-content/uploads/2021/06/logo-c3-1.png" alt="1"/>
                        </Link>
                    </Col>
                    {/*<Col md={3} style={{maxHeight: "100%"}} className="header__mobile-search">
                        <InputGroup>
                            <Form.Control
                                placeholder="Tìm kiếm..."
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                            />
                            <Button variant="outline-secondary" id="button-addon2">
                                <Search/>
                            </Button>
                        </InputGroup>
                    </Col>*/}
                    <Col lg={3} sm={5} xs={4} style={{maxHeight: "100%"}}>
                        <div  style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "black", justifyContent: "end", backgroundColor: "#ffffff"}}>
                            {(isAuthenticated) ? 
                                (   
                                    <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "black", justifyContent: "start", backgroundColor: "#ffffff", border: "none"}}>
                                        
                                        <Dropdown style={{display: "flex", width: "calc(100% - 50px)", height: "100%", alignItems: "center", color: "black", justifyContent: "start", backgroundColor: "#ffffff", border: "none"}}>
                                            <Dropdown.Toggle className="user-dropdown"  style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "black", justifyContent: "center", backgroundColor: "#ffffff", border: "none"}}>
                                                <img src={user.avatarUrl ? user.avatarUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/OOjs_UI_icon_userAvatar-constructive.svg/60px-OOjs_UI_icon_userAvatar-constructive.svg.png"} alt="username" style={{width: "50px", height: "50px", objectFit: "cover", border: "1px solid red", borderRadius: "50%"}}/>
                                                <p className="nav-username" style={{margin: "0 0 0 12px", fontSize: "1rem"}}>{user.name ? user.name : user.username}</p>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{marginLeft: "42px"}}>
                                                <Dropdown.Item as={Link} to="/profile" className="nav-dropdown-btn">Hồ sơ</Dropdown.Item>
                                                <Dropdown.Item
                                                    className="nav-dropdown-btn"
                                                    as={Link} to="/cart"
                                                >Giỏ hàng
                                                </Dropdown.Item>
                                                {user.role === 'admin' ?
                                                    <Dropdown.Item
                                                        className="nav-dropdown-btn"
                                                        as={Link} to="/admin/product"
                                                    >Trang quản lý
                                                    </Dropdown.Item>
                                                    : <p></p>
                                                }
                                                <Dropdown.Item
                                                    className="nav-dropdown-btn"
                                                    onClick={logout}
                                                >Đăng xuất
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                ) : <Link to='/login' className="login-btn">Đăng nhập</Link>
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid style={{minHeight: "40px", backgroundColor: "#34a853"}}>
                <Row className="nav__container nav-dropdown__row">
                    <Col md={9} sm={6} xs={6} className="nav-dropdown__col">
                        <Navbar style={{padding: "0"}}>
                            <Nav>
                                <Dropdown>
                                    <Dropdown.Toggle className="nav-dropdown">DANH MỤC</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/" className="nav-dropdown-btn">TRANG CHỦ</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/product" className="nav-dropdown-btn">SẢN PHẨM</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/news" className="nav-dropdown-btn">TIN TỨC</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/news/64526739b0e460d7188f6bbe" className="nav-dropdown-btn">GIỚI THIỆU</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/news/645267d4b0e460d7188f6bdf" className="nav-dropdown-btn">LIÊN HỆ</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Nav.Link style={{paddingLeft: "0"}} as={Link} to="/" className="nav-link-btn">TRANG CHỦ</Nav.Link>
                                <Nav.Link as={Link} to="/product" className="nav-link-btn">SẢN PHẨM</Nav.Link>
                                <Nav.Link as={Link} to="/news" className="nav-link-btn">TIN TỨC</Nav.Link>
                                <Nav.Link as={Link} to="/news/64526739b0e460d7188f6bbe" className="nav-link-btn">GIỚI THIỆU</Nav.Link>
                                <Nav.Link as={Link} to="/news/645267d4b0e460d7188f6bdf" className="nav-link-btn">LIÊN HỆ</Nav.Link>
                            </Nav>
                        </Navbar>
                    </Col>
                    {/*<Col md={2} sm={3} xs={6}>
                        <div  style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "#ffffff", justifyContent: "start", backgroundColor: "#34a853"}}>
                            <Dropdown style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "#ffffff", justifyContent: "start", backgroundColor: "#34a853", border: "none"}}>
                                <Dropdown.Toggle className="user-dropdown"  style={{display: "flex", width: "100%", height: "100%", alignItems: "center", color: "#ffffff", justifyContent: "start", backgroundColor: "#34a853", border: "none"}}>
                                    <PersonCircle style={{fontSize: "1.5rem"}}/><p style={{margin: "0 0 0 8px", fontSize: "1rem"}}>Username</p>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile" className="nav-dropdown-btn">Hồ sơ</Dropdown.Item>
                                    <Dropdown.Item
                                        className="nav-dropdown-btn"
                                        onClick={logout}
                                    >Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>*/}
                </Row>
            </Container>
        </div>
    )
}