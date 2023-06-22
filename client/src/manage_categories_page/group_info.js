import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import * as CategoryService from "../utils/category_service";
import {AddCategoryForm} from "./add_category_form";
import React from "react";
import {Category} from "./category";
import * as GroupService from "../utils/group_service";
import {Group} from "./group";

export function GroupInfo({group, onDeleteGroup, onUpdateGroup}) {
    const [categories, setCategories] = GroupService.GetGroupInfo(group.group_id);
    const handleAddCategory = (category) => {
        console.log(category);
        CategoryService.AddCategory(category, group.group_id).then((r) => {
            setCategories([...categories, {category_id: r.category_id, description: category}]);
        })
    }
    const onDeleteCategory = (category_id) => {
        CategoryService.DeleteCategory(category_id).then((r) => {
            setCategories((prevCategories) => prevCategories.filter((category) => category.category_id !== category_id));
        })
    }
    const onUpdateCategory = (updated_category) => {
        CategoryService.UpdateCategory(updated_category).then((r) => {
                const spendings_without_updated = categories.filter((category) => category.category_id !== updated_category.category_id);
                setCategories([...spendings_without_updated, updated_category]);
            }
        );
    }

    const sorted_categories = categories.sort((a, b) => a.category_id - b.category_id);

    return (<div>
        <Card style={{width: "70%"}}>
            <Card.Header>
                <Group group={group} onDeleteGroup={onDeleteGroup} onUpdateGroup={onUpdateGroup}/>
            </Card.Header>
            <ListGroup variant='flush'>
                {sorted_categories.map((category) =>
                    <ListGroupItem key={category.category_id}>
                        <Category category={category} onUpdateCategory={onUpdateCategory}
                                  onDeleteCategory={onDeleteCategory}/>
                    </ListGroupItem>)}
                <Card.Footer>
                    <AddCategoryForm onAddCategory={handleAddCategory}/>
                </Card.Footer>
            </ListGroup>
        </Card>
        <br/>
    </div>);
}
