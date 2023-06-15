import React, {useState} from "react";
import {Router, Routes, Route, redirect, useNavigate, useLocation} from "react-router-dom";
import StatisticsPage from "./stats_page/statistics_page";
import AllSpendingsPage from "./all_spendings_page/main_spendings_page";
import HomePage from "./homepage/homepage";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";
import CategoriesPage from "./manage_categories_page/main_categories_page";

function App() {
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState('');

    const handleActiveKeyChange = (key) => {
        setActiveKey(key);
    }
    const handleSelect = (key) => {
        if (key === 'home') {
            navigate('/')
        } else if (key === 'spendings') {
            navigate('/all_spendings')
        } else if (key === 'statistics') {
            navigate('/statistics')
        } else if (key === 'categories') {
            navigate('/categories')
        }
        setActiveKey(key);
    }
    return (
        <nav>
            <Tabs onSelect={handleSelect} activeKey={activeKey} unmountOnExit={true} mountOnEnter={true}
                  transition={false}>
                <Tab title='Home' eventKey='home'/>
                <Tab title='All Spendings' eventKey='spendings'/>
                <Tab title='Statistics' eventKey='statistics'/>
                <Tab title="Categories" eventKey='categories'/>
            </Tabs>
            <br/>
            <Routes>
                <Route exact path="/" element={<HomePage changeTab={handleActiveKeyChange}/>}/>
                <Route exact path="/all_spendings" element={<AllSpendingsPage changeTab={handleActiveKeyChange}/>}/>
                <Route exact path="/statistics" element={<StatisticsPage changeTab={handleActiveKeyChange}/>}/>
                <Route exact path="/categories" element={<CategoriesPage changeTab={handleActiveKeyChange}/>}/>
            </Routes>
        </nav>
    );
}

export default App;