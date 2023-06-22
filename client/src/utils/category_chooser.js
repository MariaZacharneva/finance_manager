import {Form} from "react-bootstrap";
import React from "react";

export function CategoryChooser({groups, categories, selectedCategories, setSelectedCategories}) {
    const handleCategoryChange = (group_id, category_id, event) => {
        const newSelectedCategories = {...selectedCategories};
        newSelectedCategories[group_id] = parseInt(category_id);
        setSelectedCategories(newSelectedCategories);
    }

    return (<>
        {groups.map((group) => {
        const categories_for_group = categories
            .filter(cat => cat.group_id === group.group_id)
            .sort((a, b) => (a.category_id - b.category_id));
        return <Form.Label>
            {group.description}
            <Form.Select onChange={(e) => handleCategoryChange(group.group_id, e.target.value, e)}>
                <option value={0}>--- None ---</option>
                {categories_for_group.map(cat => {
                    if (selectedCategories[group.group_id] === cat.category_id) {
                        return (<option value={cat.category_id} selected>{cat.description}</option>)
                    }
                    return (<option value={cat.category_id}>{cat.description}</option>)
                })}
            </Form.Select>
        </Form.Label>
    })}</>);
}
