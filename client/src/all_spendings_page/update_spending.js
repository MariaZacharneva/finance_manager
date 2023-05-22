import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {UnifyDate} from "../utils/date_unificator";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

export function UpdateSpendingForm({spending, onSave, onCancel}) {
    const [description, setDescription] = useState(spending.description);
    const [value, setValue] = useState(spending.value);
    const [currency, setCurrency] = useState(spending.currency);
    const [date, setDate] = useState(new Date(spending.date));

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedSpending = {
            spending_id: spending.spending_id,
            description: description,
            value: value,
            currency: currency,
            date: UnifyDate(date)
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
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>{' '}
                <Button variant="primary" type="submit" >Save</Button>
            </Form>
        </Modal.Body>);
}

export function UpdateSpending({spending, onUpdateSpending}) {
    const [showUpdateForm, setShowUpdateFrom] = useState(false);
    const handleClick = (spending) => {
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
        <Button variant="outline-dark" onClick={() => setShowUpdateFrom(true)}>
            Update
        </Button>
        <Modal show={showUpdateForm} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>UpdateSpending</Modal.Title>
            </Modal.Header>
            <UpdateSpendingForm spending={spending} onSave={handleClick} onCancel={handleCancel}/>
        </Modal>
    </div>);
}
