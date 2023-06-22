import AddSpendingForm from "./add_spending_form";
import {AddGroupForm} from "./groups"
import SpendingList from "./spending_list";
import * as SpendingService from "../utils/spendings_service";
import {useEffect} from "react";
import * as GroupService from "../utils/group_service";
import * as CategoryService from "../utils/category_service";

function AllSpendingsPage({changeTab}) {
    useEffect(() => {
        changeTab('spendings');
    }, [changeTab]);

    const [spendings, setSpendings] = SpendingService.GetAllSpendings();
    const [categories, setCategories] = CategoryService.GetAllCategories();
    const [groups, setGroups] = GroupService.GetAllGroups();
    const handleAddSpending = (newSpending) => {
        SpendingService.AddSpending(newSpending).then((response) => {
            const spending = {
                ...response.new_spending,
                categories: response.new_spending.groups_and_categories
                    .map(info => {
                        return {
                            group_id: info.group_id,
                            group_description: groups.find(gr => gr.group_id === info.group_id).description,
                            category_id: info.category_id,
                            category_description: categories.find(cat => cat.category_id === info.category_id).description,
                        }
                    })
            }
            console.log(spending);
            setSpendings([...spendings, spending]);
        });
    };

    const handleDeleteSpending = (spending_id) => {
        SpendingService.DeleteSpending(spending_id).then(() => {
            setSpendings((prevSpendings) => prevSpendings.filter((spending) => spending.spending_id !== spending_id));
        })
    }
    const handleUpdateSpending = (updated_spending) => {
        SpendingService.UpdateSpending(updated_spending).then((response) => {
            console.log(response)
                const spending = {
                    ...response.new_spending,
                    categories: response.new_spending.groups_and_categories
                        .map(info => {
                            return {
                                group_id: info.group_id,
                                group_description: groups.find(gr => gr.group_id === info.group_id).description,
                                category_id: info.category_id,
                                category_description: categories.find(cat => cat.category_id === info.category_id).description,
                            }
                        })
                }
                console.log(spending);
                const spendings_without_updated = spendings.filter((spending) => spending.spending_id !== updated_spending.spending_id);
                setSpendings([...spendings_without_updated, spending]);
            }
        );
    }

    return (<div>
        <h2>Add Spending</h2>
        <AddSpendingForm onAddSpending={handleAddSpending} groups={groups} categories={categories}/>
        <br/>
        <SpendingList spendings={spendings} onDeleteSpending={handleDeleteSpending}
                      onUpdateSpending={handleUpdateSpending} groups={groups} categories={categories}/>
    </div>);
}

export default AllSpendingsPage;
