import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export function MainTabs() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">Finance manager</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/all_spendings">Spendings</Nav.Link>
                        <Nav.Link href="/statistics">Statistics</Nav.Link>
                        <Nav.Link href="/categories">Statistics</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
}