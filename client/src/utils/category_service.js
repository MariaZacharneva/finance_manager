import {useState, useEffect} from "react";
import axios from "axios";
import logger from "./logger";

const baseUrl = 'http://localhost:3001'

export async function AddCategory(category, group_id) {
    try {
        const response = await axios.post(baseUrl + "/api/categories/add_category",
            {description: category, group_id: group_id});
        return response.data;
    } catch (error) {
        console.log("Error while creating new category: ", category);
        throw new Error("Failed to create new category");
    }
}

export async function DeleteCategory(category_id) {
    try {
        console.log(category_id);
        const response = await axios.post(baseUrl + "/api/categories/delete_category", {category_id: category_id});
        return response.data;
    } catch (error) {
        console.error("Error while deleting category:", error);
        throw new Error("Failed to delete category from the server.");
    }
}

export async function UpdateCategory(category) {
    try {
        const response = await axios.post(baseUrl + "/api/categories/update_category", category);
        return response.data;
    } catch (error) {
        console.error("Error while updating category:", error);
        throw new Error("Failed to update category from the server.");
    }
}