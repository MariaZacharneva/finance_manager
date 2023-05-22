import AddSpendingForm from "./add_spending_form";
import {AddGroupForm} from "./groups"
import SpendingList from "./spending_list";
import * as SpendingService from "../utils/spendings_service";
import {DateTime} from "luxon";

function AllSpendingsPage() {
    const [spendings, setSpendings] = SpendingService.GetAllSpendings();
    const handleAddSpending = (newSpending) => {
        SpendingService.AddSpending(newSpending).then((response) => {
            setSpendings([...spendings, response.new_spending]);
        });
    };

    const handleDeleteSpending = (spending_id) => {
        SpendingService.DeleteSpending(spending_id).then(() => {
            setSpendings((prevSpendings) => prevSpendings.filter((spending) => spending.spending_id !== spending_id));
        })

    }
    const handleUpdateSpending = (updated_spending) => {
        console.log(updated_spending.date);
        SpendingService.UpdateSpending(updated_spending).then((r) => {
                const spendings_without_updated = spendings.filter((spending) => spending.spending_id !== updated_spending.spending_id);
                setSpendings([...spendings_without_updated, updated_spending]);
            }
        );
    }

    return (<div>
        <h2>Add Spending</h2>
        <AddSpendingForm onAddSpending={handleAddSpending}/>
        <br/>
        <SpendingList spendings={spendings} onDeleteSpending={handleDeleteSpending}
                      onUpdateSpending={handleUpdateSpending}/>
    </div>);
}

export default AllSpendingsPage;
