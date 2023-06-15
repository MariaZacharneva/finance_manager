import React, {useState} from "react";
import {Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row} from "react-bootstrap";
import {DeleteGroupButton} from "./delete_group";
import {UpdateGroupButton} from "./update_group_modal";

export function GroupTextWithButtons({setShowForm, group, onUpdateGroup, onDeleteGroup}) {
    const handleDoubleClick = () => {
        setShowForm(true);
    };
    return (<div>
        <Row>
            <Col>
                <div onDoubleClick={handleDoubleClick}>{group.description}</div>
            </Col>
            <Col xs="auto">
                <DropdownButton variant="outline-dark" title="">
                    <UpdateGroupButton onUpdateGroup={onUpdateGroup} group={group}/>
                    <Dropdown.Divider/>
                    <DeleteGroupButton onDeleteGroup={onDeleteGroup} group={group}/>
                </DropdownButton></Col>
        </Row>
    </div>);
}

export function InlineGroupChange({group, onUpdateGroup, setShowForm}) {
    const [description, setDescription] = useState(group.description);
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
        const updated_group = {
            description: description,
            group_id: group.group_id
        };
        onUpdateGroup(updated_group);
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

export function Group({group, onDeleteGroup, onUpdateGroup}) {
    const [showForm, setShowForm] = useState(false);
    if (showForm) {
        return (
            <InlineGroupChange group={group} setShowForm={setShowForm} onUpdateGroup={onUpdateGroup}/>);
    }
    return (<GroupTextWithButtons setShowForm={setShowForm} group={group}
                                     onUpdateGroup={onUpdateGroup} onDeleteGroup={onDeleteGroup}/>);

}
