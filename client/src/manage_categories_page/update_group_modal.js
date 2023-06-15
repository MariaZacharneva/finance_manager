import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

export function UpdateGroupForm({onSubmit, group, onCancel}) {
    const [description, setDescription] = useState(group.description);
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

export function UpdateGroupButton({group, onUpdateGroup}) {
    const [showUpdateForm, setShowUpdateFrom] = useState(false);
    const handleSubmit = (description) => {
        const updated_group = {
            description: description,
            group_id: group.group_id
        }
        onUpdateGroup(updated_group);
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
                <Modal.Title>Update Group</Modal.Title>
            </Modal.Header>
            <UpdateGroupForm group={group} onSubmit={handleSubmit} onCancel={handleCancel}/>
            <Modal.Footer>This can also be done by double-clicking the group name</Modal.Footer>
        </Modal>
    </div>);
}
