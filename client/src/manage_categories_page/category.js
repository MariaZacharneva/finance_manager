import React, {useState} from "react";
import {Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row} from "react-bootstrap";
import {DeleteCategoryButton} from "./delete_category";
import {UpdateCategoryButton} from "./update_category_modal";

export function CategoryTextWithButtons({setShowForm, category, onUpdateCategory, onDeleteCategory}) {
    const handleDoubleClick = () => {
        setShowForm(true);
    };
    return (<div>
        <Row>
            <Col>
                <div onDoubleClick={handleDoubleClick}>{category.description}</div>
            </Col>
            <Col xs="auto">
                <DropdownButton variant="outline-dark" title="">
                    <UpdateCategoryButton onUpdateCategory={onUpdateCategory} category={category}/>
                    <Dropdown.Divider/>
                    <DeleteCategoryButton onDeleteCategory={onDeleteCategory} category={category}/>
                </DropdownButton></Col>
        </Row>
    </div>);
}

export function InlineCategoryChange({category, onUpdateCategory, setShowForm}) {
    const [description, setDescription] = useState(category.description);
    const handleBlur = (e) => {
        if (!e.currentTarget.parentNode.contains(e.relatedTarget)) {
            setShowForm(false);
        }
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const updated_category = {
            description: description,
            category_id: category.category_id
        };
        onUpdateCategory(updated_category);
        setShowForm(false);
    }
    return (
        <div>
            <Row>
                <InputGroup onBlur={handleBlur}>
                    <Col>
                        <Form.Control onChange={handleDescriptionChange} autoFocus={true} value={description}/>
                    </Col>
                    <Col xs="auto">
                        <Button variant="outline-dark" type="submit" onClick={handleSubmit}>Save</Button>
                    </Col>
                </InputGroup>
            </Row>
        </div>);
}

export function Category({category, onDeleteCategory, onUpdateCategory}) {
    const [showForm, setShowForm] = useState(false);
    if (showForm) {
        return (
            <InlineCategoryChange category={category} setShowForm={setShowForm} onUpdateCategory={onUpdateCategory}/>);
    }
    return (<CategoryTextWithButtons setShowForm={setShowForm} category={category}
                                     onUpdateCategory={onUpdateCategory} onDeleteCategory={onDeleteCategory}/>);

}
