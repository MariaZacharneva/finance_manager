import {Button, Form, InputGroup} from "react-bootstrap";
import React, {useState} from "react";

export function AddCategoryForm({onAddCategory}) {
    const [category, setCategory] = useState('');

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (!category) {
            alert('Category name cannot be empty');
            return;
        }
        onAddCategory(category);
        setCategory('');
    }
    return (<div>
        <InputGroup>
            <Form.Control type='text' placeholder='Add category' value={category} onChange={handleCategoryChange}/>
            <Button onClick={handleCategorySubmit} variant="outline-dark" type='submit' className='float-end'>Add</Button>
        </InputGroup>
    </div>);
}
