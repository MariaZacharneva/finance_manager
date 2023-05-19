import React from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import StatisticsPage from "./stats_page/statistics_page";
import AllSpendingsPage from "./all_spendings_page/all_spendings_page";
import HomePage from "./homepage/homepage";
import axios from "axios";

function App() {
    return (
        <Router>
            <div><Link to="/all_spendings">Add Spending</Link></div>
            <div><Link to="/statistics">Statistics</Link></div>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/all_spendings" element={<AllSpendingsPage/>}/>
                <Route exact path="/statistics" element={<StatisticsPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
