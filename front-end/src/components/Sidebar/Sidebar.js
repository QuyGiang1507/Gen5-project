import { Nav, Row, Col, Tab, Navbar } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

export default function Sidebar() {
    return (
        <Tab.Container id="left-tabs-example">
            <Row>
                <Col sm={12} md={12} xs={12}>
                    <Nav variant="pills" className="flex-column">
                        <Navbar.Brand style={{fontSize: "28px", fontWeight: "bold"}}>Danh mục</Navbar.Brand>
                    <Nav.Item>
                        <Nav.Link as={Link} to='/admin/product'>Quản lý sản phẩm</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to='/admin/news'>Quản lý tin tức</Nav.Link>
                    </Nav.Item>
                    </Nav>
                </Col>
            </Row>
        </Tab.Container>
    )
}