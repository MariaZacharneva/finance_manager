import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

export function DeleteSpending({spending, onDeleteSpending}) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleClick = () => {
        onDeleteSpending(spending.spending_id);
        setShowDeleteAlert(false);
    };
    const handleCancel = (e) => {
        e.preventDefault();
        setShowDeleteAlert(false);
    }
    const handleHide = () => {
        setShowDeleteAlert(false);
    }
    return (<div>
        <DropdownItem variant="outline-danger"     onClick={() => setShowDeleteAlert(true)}>Delete</DropdownItem>
        <Modal show={showDeleteAlert} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Spending</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete "{spending.description}"? This cannot be undone</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleClick}>
                    Delete
                </Button>
            </Modal.Footer> </Modal>
    </div>);
}
