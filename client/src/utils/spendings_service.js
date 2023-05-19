import {useState, useEffect} from "react";
import axios from "axios";
import logger from "./logger";

const baseUrl = 'http://localhost:3001'
export function GetAllSpendings() {
    const [spendings, setSpendings] = useState([]);
    useEffect(() => {
        try {
            axios.post(baseUrl + "/api/spendings/get_all_spendings")
                .then(response => {
                    console.log(response)
                    setSpendings(response.data.spendings)
                });
        } catch (error) {
            logger.logError("Error while fetching spendings:", error);
        }
    }, []);
    return [spendings, setSpendings];
}

export async function AddSpending(newSpending) {
    try {
        const response = await axios.post(baseUrl + "/api/spendings/add_spending", newSpending);
        return response.data;
    } catch (error) {
        console.error("Error while adding spending:", error);
        throw new Error("Failed to add spending to the server.");
    }
}