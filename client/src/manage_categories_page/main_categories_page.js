import React, {useEffect, useState} from "react";
import * as CategoryService from "../utils/category_service";
import {Button, Card, Col, Form, InputGroup, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import CreateGroupForm from "./create_group_form";
import {AddCategoryForm} from "./add_category_form";
import {GroupInfo} from "./group_info";
import * as GroupService from "../utils/group_service";

const CategoriesPage = ({changeTab}) => {
    useEffect(() => {
        changeTab('categories');
    }, [changeTab]);

    const [groups, setGroups] = GroupService.GetAllGroups();

    const handleCreateGroup = (group) => {
        GroupService.CreateGroup(group).then((r) => {
            setGroups([...groups, {group_id: r.group_id, description: group}]);
        })
    }
    const handleDeleteGroup = (group_id) => {
        GroupService.DeleteGroup(group_id).then((r) => {
            setGroups((prevGroups) => prevGroups.filter((group) => group.group_id !== group_id));
        })
    }
    const handleUpdateGroup = (updated_group) => {
        GroupService.UpdateGroup(updated_group).then((r) => {
                const groups_without_updated = groups.filter((group) => group.group_id !== updated_group.group_id);
                setGroups([...groups_without_updated, updated_group]);
            }
        );
    }

    const sortedGroups = groups.sort((a, b) => {
        return a.group_id - b.group_id;
    });
    return (<div>
        <h2>Manage Categories</h2>
        <CreateGroupForm onCreateGroup={handleCreateGroup}/>
        <br/>
        <h2>Existing groups</h2>

        {sortedGroups.map((group) =><GroupInfo group={group} key={group.group_id} onUpdateGroup={handleUpdateGroup}
                                          onDeleteGroup={handleDeleteGroup}/>)}

    </div>)
}

export default CategoriesPage;
