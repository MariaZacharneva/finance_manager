import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {UnifyDate} from "../utils/date_unificator";
import {Button, Form} from "react-bootstrap";

function AddSpendingForm({onAddSpending}) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);
    const [currency, setCurrency] = useState('PLN');
    const [date, setDate] = useState(new Date());

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleValueChange = (e) => {
        setValue(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description || !value || !currency || !date) {
            alert('Please fill out all fields');
            return;
        }
        const newSpending = {
            description: description,
            value: value,
            currency: currency,
            date: UnifyDate(date),
        };

        // Pass the new spending object up to the parent component
        onAddSpending(newSpending);

        // Reset the form except the date
        setDescription('');
        setValue(0);
        setCurrency('PLN');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Label >
                Description
                <Form.Control type="text" value={description} onChange={handleDescriptionChange}/>
            </Form.Label>
            <br/>
            <Form.Label>
                Value:
                <Form.Control type="number" value={value} onChange={handleValueChange}/>
            </Form.Label>
            <Form.Label>
                Currency:
                <Form.Select value={currency} onChange={handleCurrencyChange}>
                    <option value="PLN">PLN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </Form.Select>
            </Form.Label>
            <br/>
            <Form.Label>
                Date:
                <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                    controls={['date']}
                />
            </Form.Label>
            <br/>
            <Button variant="outline-dark" type="submit">Add Spending</Button>
        </Form>
    );
}

export default AddSpendingForm;