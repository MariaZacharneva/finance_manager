import {useState} from "react";
import {Button} from "react-bootstrap";

export const AddGroupForm = ({onAddGroup}) => {
    const [groupName, setGroupName] = useState('');
    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!groupName) {
            alert("Group name cannot be empty")
            return;
        }
        onAddGroup(groupName);
        setGroupName('');
    }
    return (<div>
        <form onSubmit={handleSubmit}>
            Group name:
            <input type="text" onChange={handleGroupNameChange}/>
            <Button variant="outline-dark"  type="submit">Create group</Button>
        </form>
    </div>);
}

const AddCategoryToGroup = ({onAddCategory}) => {

}

export default {
    AddGroupForm: AddGroupForm,
    AddCategoryToGroup: AddCategoryToGroup
};