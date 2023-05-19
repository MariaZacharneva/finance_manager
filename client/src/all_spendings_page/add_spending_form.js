import React, {useState} from 'react';
import Logger from "../utils/logger";
import {AddSpending} from "../utils/spendings_service";

function AddSpendingForm({onAddSpending}) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [date, setDate] = useState('');
    const [formError, setFormError] = useState('');

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleValueChange = (e) => {
        setValue(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
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
            date: (new Date(date)).getTime(),
        };

        // Pass the new spending object up to the parent component
        onAddSpending(newSpending);

        // Reset the form
        setDescription('');
        setValue(0);
        setCurrency('USD');
        setDate('');
        setFormError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            {formError && <div className="error">{formError}</div>}
            <label>
                Description:
                <input type="text" value={description} onChange={handleDescriptionChange}/>
            </label>
            <br/>
            <label>
                Value:
                <input type="number" value={value} onChange={handleValueChange}/>
            </label>
            <br/>
            <label>
                Currency:
                <select value={currency} onChange={handleCurrencyChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                </select>
            </label>
            <br/>
            <label>
                Date:
                <input type="date" value={date} onChange={handleDateChange}/>
            </label>
            <br/>
            <button type="submit">Add Spending</button>
        </form>
    );
}

export default AddSpendingForm;
