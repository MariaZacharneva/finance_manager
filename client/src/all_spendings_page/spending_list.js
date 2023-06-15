import {UpdateSpending, UpdateSpendingForm} from "./update_spending";
import {Button, Dropdown, DropdownButton, Modal, Table} from "react-bootstrap";
import {DeleteSpending} from "./delete_spending";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";

function SpendingList({spendings, onDeleteSpending, onUpdateSpending}) {
    const sortedSpendings = spendings.sort((a, b) => {
        const dateA = new Date(a.date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.date).setHours(0, 0, 0, 0);
        const dateComparison = dateB - dateA;
        if (dateComparison !== 0) {
            return dateComparison;
        }
        return b.spending_id - a.spending_id;
    });

    return (
        <div>
            <h2>Spending List</h2>
            <Table striped bordered hover size="sm" style={tableStyle}>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Value</th>
                    <th>Currency</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {sortedSpendings.map((spending) => (
                    <tr key={spending.spending_id}>
                        <td style={tableCellStyle}>{spending.description}</td>
                        <td style={tableCellStyle}>{spending.value}</td>
                        <td style={tableCellStyle}>{spending.currency}</td>
                        <td style={tableCellStyle}>{
                            (new Date(spending.date)).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                        <td style={tableCellStyle}><DropdownButton title={""} variant="outline-dark">
                            <UpdateSpending spending={spending}
                                            onUpdateSpending={onUpdateSpending}/>
                            <Dropdown.Divider/>
                            <DeleteSpending spending={spending}
                                            onDeleteSpending={onDeleteSpending}/>
                        </DropdownButton></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

const tableStyle = {
    tableLayout: 'auto',
    maxWidth: '70%',
}

const tableCellStyle = {
    border: "0px solid black",
    textAlign: 'center',
    backgroundColor: 'white',
    maxWidth: '100px',
    wordWrap: 'break-word',
};

export default SpendingList;
