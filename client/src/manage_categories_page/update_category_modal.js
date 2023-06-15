import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

export function UpdateCategoryForm({onSubmit, category, onCancel}) {
    const [description, setDescription] = useState(category.description);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(description);
    }
    return (
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Label>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>{' '}
                <Button variant="primary" type="submit">Save</Button>
            </Form>
        </Modal.Body>);
}

export function UpdateCategoryButton({category, onUpdateCategory}) {
    const [showUpdateForm, setShowUpdateFrom] = useState(false);
    const handleSubmit = (description) => {
        const updated_category = {
            description: description,
            category_id: category.category_id
        }
        onUpdateCategory(updated_category);
        setShowUpdateFrom(false);
    };
    const handleCancel = (e) => {
        e.preventDefault();
        setShowUpdateFrom(false);
    }
    const handleHide = () => {
        setShowUpdateFrom(false);
    }
    return (<div>
        <DropdownItem as="button" variant="outline-dark" onClick={() => setShowUpdateFrom(true)}>
            Update
        </DropdownItem>
        <Modal show={showUpdateForm} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Category</Modal.Title>
            </Modal.Header>
            <UpdateCategoryForm category={category} onSubmit={handleSubmit} onCancel={handleCancel}/>
            <Modal.Footer>This can also be done by double-clicking the category name</Modal.Footer>
        </Modal>
    </div>);
}
