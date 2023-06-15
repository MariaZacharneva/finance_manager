import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";

export function CreateGroupForm({onCreateGroup}) {
    const [group, setGroup] = useState('');

    const handleGroupChange = (e) => {
        setGroup(e.target.value);
    }
    const handleGroupSubmit = (e) => {
        e.preventDefault();
        if (!group) {
            alert('Group name cannot be empty');
            return;
        }
        onCreateGroup(group);
        setGroup('');
    }
    return (<div>
        <Form onSubmit={handleGroupSubmit}>
            <Form.Label>Create new group
                <Form.Control onChange={handleGroupChange} type='text' placeholder='Group name' value={group}/>
            </Form.Label>
            <br/>
            <Button variant="outline-dark" type='submit'>Create</Button>
        </Form>
    </div>);
}

export default CreateGroupForm;
