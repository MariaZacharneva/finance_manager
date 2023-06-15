import {useEffect, useState} from "react";
import axios from "axios";
import logger from "./logger";

const baseUrl = 'http://localhost:3001'
export function GetAllGroups() {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        try {
            axios.post(baseUrl + "/api/groups/get_all_groups")
                .then(response => {
                    console.log(response)
                    setGroups(response.data.groups)
                });
        } catch (error) {
            logger.logError("Error while fetching spendings:", error);
        }
    }, []);
    return [groups, setGroups];
}

export function GetGroupInfo(group_id) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        try {
            axios.post(baseUrl + "/api/groups/get_group_info", {group_id: group_id})
                .then(response => {
                    console.log(response)
                    setCategories(response.data.categories)
                });
        } catch (error) {
            logger.logError("Error while fetching spendings:", error);
        }
    }, [group_id]);
    return [categories, setCategories];
}

export async function CreateGroup(group_name) {
    try {
        const response = await axios.post(baseUrl + "/api/groups/add_group", {description: group_name});
        return response.data;
    } catch (error) {
        console.log("Error while creating new group: ", group_name);
        throw new Error("Failed to create new group");
    }
}

export async function DeleteGroup(group_id) {
    try {
        console.log(group_id);
        const response = await axios.post(baseUrl + "/api/groups/delete_group", {group_id: group_id});
        return response.data;
    } catch (error) {
        console.error("Error while deleting group:", error);
        throw new Error("Failed to delete group from the server.");
    }
}

export async function UpdateGroup(group) {
    try {
        const response = await axios.post(baseUrl + "/api/groups/update_group", group);
        return response.data;
    } catch (error) {
        console.error("Error while updating group:", error);
        throw new Error("Failed to update group from the server.");
    }
}