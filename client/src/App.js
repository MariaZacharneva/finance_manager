import React from "react";
import {Router, Routes, Route, redirect, useNavigate} from "react-router-dom";
import StatisticsPage from "./stats_page/statistics_page";
import AllSpendingsPage from "./all_spendings_page/main_spendings_page";
import HomePage from "./homepage/homepage";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";


function App() {
    const navigate = useNavigate();
    const handleSelect = (key) => {
        if (key === 'home') {
            console.log('click')
            navigate('/')

        } else if (key === 'spendings') {
            console.log('click')
            navigate('/all_spendings')

        } else if (key === 'statistics') {
            console.log('click')
            navigate('/statistics')

        }
    }
    return (
        <nav>
            <Tabs onSelect={handleSelect}>
                <Tab title='Home' eventKey='home'/>
                <Tab title='All Spendings' eventKey='spendings'/>
                <Tab title='Statistics' eventKey='statistics'/>
            </Tabs>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/all_spendings" element={<AllSpendingsPage/>}/>
                <Route exact path="/statistics" element={<StatisticsPage/>}/>
            </Routes>
        </nav>
    );
}

export default App;