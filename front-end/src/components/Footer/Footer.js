import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Instagram, Twitter, Youtube } from 'react-bootstrap-icons';


import './footer.css'

export default function Footer () {
    return (
        <div>
            <Container fluid style={{padding: "10px 0", backgroundColor: "#34a853", color: "#ffffff"}}>
                <Row style={{width: "100%", maxWidth: "1080px", margin: "auto", justifyContent: "space-between", alignItems: "start", padding: "0 15px", height: "100%"}}>
                    <Col md={5} sm={4} xs={12} style={{maxHeight: "100%"}}>
                        <h5>Công ty TNHH C3</h5>
                        <p><b>Địa chỉ:</b> Số 1 Quang Trung, Hoàn Kiếm, Hà Nội</p>
                        <p><b>Số điện thoại:</b> <a href="tel:0123456789">0123.456.789</a></p>
                        <p><b>Email:</b> <a href="mailto:c3shop@gmail.com">c3shop@gmail.com</a></p>
                    </Col>
                    <Col md={3} sm={4} xs={12} style={{maxHeight: "100%"}}>
                        <h5>Đối tác liên kết</h5>
                        <p><a target="_blank" href="https://www.vietnamairlines.com/" rel="noreferrer">Vietnam Airline</a></p>
                        <p><a target="_blank" href="https://www.bambooairways.com/" rel="noreferrer">Bamboo Airways</a></p>
                        <p><a target="_blank" href="https://hanoitourist.vn/" rel="noreferrer">Hanoitourist</a></p>
                        <p><a target="_blank" href="https://vivafoods.vn/" rel="noreferrer">Viva Foods</a></p>
                        <p><a target="_blank" href="https://yody.vn/" rel="noreferrer">YODY</a></p>
                    </Col>
                    <Col md={3} sm={4} xs={12} style={{maxHeight: "100%"}}>
                        <h5 style={{textAlign: "center"}}>Kết nối với chúng tôi</h5>
                        <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
                            <p style={{padding: "0 10px"}}><a target="_blank" href="https://www.facebook.com/" style={{fontSize: "1.5rem"}} rel="noreferrer"><Facebook/></a></p>
                            <p style={{padding: "0 10px"}}><a target="_blank" href="https://www.instagram.com/" style={{fontSize: "1.5rem"}} rel="noreferrer"><Instagram/></a></p>
                            <p style={{padding: "0 10px"}}><a target="_blank" href="https://twitter.com/" style={{fontSize: "1.5rem"}} rel="noreferrer"><Twitter/></a></p>
                            <p style={{padding: "0 10px"}}><a target="_blank" href="https://www.youtube.com/" style={{fontSize: "1.5rem"}} rel="noreferrer"><Youtube/></a></p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div style={{width: "100%", backgroundColor: "#34a853", opacity: "0.7", minHeight: "40px", padding: "8px 0"}}>
                <p style={{margin: "0", textAlign: "center", color: "#ffffff"}}>Copyright © 2022 C3 Shop</p>
            </div>
        </div>
    )
}