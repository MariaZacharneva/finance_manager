import AddSpendingForm from "./add_spending_form";
import {AddGroupForm} from "./groups"
import SpendingList from "./spending_list";
import {GetAllSpendings, AddSpending} from "../utils/spendings_service"

function AllSpendingsContainer({spendings, setSpendings, groups, setGroups}) {
    const handleAddSpending = (newSpending) => {
        AddSpending(newSpending).then(() => {
            setSpendings([...spendings, newSpending]);
        });
    };
    const handleAddGroup = (groupName) => {
        setGroups([...groups, {groupName: groupName, categories: []}]);
    }
    return (
        <div>
            <AddSpendingForm onAddSpending={handleAddSpending}/>
            <br/>
            <AddGroupForm onAddGroup={handleAddGroup}/>
            <SpendingList spendings={spendings}/>
        </div>
    );
}

function AllSpendingsPage() {
    const [spendings, setSpendings] = GetAllSpendings();
    return (
        <div>
            <h2>Add Spending</h2>
            <AllSpendingsContainer spendings={spendings} setSpendings={setSpendings}/>
        </div>
    );
}

export default AllSpendingsPage;
