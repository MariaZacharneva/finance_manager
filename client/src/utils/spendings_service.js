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

export async function DeleteSpending(spending_id) {
    try {
        console.log(spending_id);
        const response = await axios.post(baseUrl + "/api/spendings/delete_spending", {spending_id: spending_id});
        return response.data;
    } catch (error) {
        console.error("Error while deleting spending:", error);
        throw new Error("Failed to delete spending from the server.");
    }
}

export async function UpdateSpending(spending) {
    try {
        const response = await axios.post(baseUrl + "/api/spendings/update_spending", spending);
        return response.data;
    } catch (error) {
        console.error("Error while updating spending:", error);
        throw new Error("Failed to update spending from the server.");
    }
}
