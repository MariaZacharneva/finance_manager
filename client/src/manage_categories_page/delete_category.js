import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

export function DeleteCategoryButton({category, onDeleteCategory}) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleClick = () => {
        onDeleteCategory(category.category_id);
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
        <DropdownItem onClick={() => setShowDeleteAlert(true)}>Delete</DropdownItem>
        <Modal show={showDeleteAlert} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete "{category.description}"? This cannot be undone.
                Spendings belonging to this category will not be deleted.</Modal.Body>
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
