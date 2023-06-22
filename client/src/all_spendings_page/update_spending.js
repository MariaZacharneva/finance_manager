import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {UnifyDate} from "../utils/date_unificator";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import * as GroupsCategoriesView from "../utils/groups_categories_view";
import {CategoryChooser} from "../utils/category_chooser";

export function UpdateSpendingForm({spending, onSave, onCancel, groups, categories}) {
    const [description, setDescription] = useState(spending.description);
    const [value, setValue] = useState(spending.value);
    const [currency, setCurrency] = useState(spending.currency);
    const [date, setDate] = useState(new Date(spending.date));
    const [selectedCategories, setSelectedCategories] = useState(GroupsCategoriesView.ArrayToObject(spending.categories));

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedSpending = {
            spending_id: spending.spending_id,
            description: description,
            value: value,
            currency: currency,
            date: UnifyDate(date),
            groups_and_categories: GroupsCategoriesView.ObjectToArray(selectedCategories),
        };
        onSave(updatedSpending);
    };

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
                <br/>
                <Form.Label>
                    <Form.Control
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    /></Form.Label>
                <Form.Label>
                    <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </Form.Select>
                </Form.Label>
                <br/>
                <Form.Label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="dd-MM-yyyy"
                        controls={['date']}
                    /></Form.Label>
                <br/>
                <CategoryChooser groups={groups} categories={categories} selectedCategories={selectedCategories}
                                 setSelectedCategories={setSelectedCategories}/>
                <br/>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>{' '}
                <Button variant="primary" type="submit">Save</Button>
            </Form>
        </Modal.Body>);
}

export function UpdateSpending({spending, onUpdateSpending, groups, categories}) {
    const [showUpdateForm, setShowUpdateFrom] = useState(false);
    const handleSave = (spending) => {
        onUpdateSpending(spending);
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
        <DropdownItem variant="outline-dark" className='floa' onClick={() => setShowUpdateFrom(true)}>
            Update
        </DropdownItem>
        <Modal show={showUpdateForm} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Spending</Modal.Title>
            </Modal.Header>
            <UpdateSpendingForm spending={spending} onSave={handleSave} onCancel={handleCancel} groups={groups}
                                categories={categories}/>
        </Modal>
    </div>);
}
