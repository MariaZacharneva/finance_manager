export function ArrayToObject(groups_to_categories) {
    console.log(groups_to_categories);
    const result = groups_to_categories.reduce((object, curr) => {
        return {...object, [curr.group_id]: curr.category_id};
    }, {});
    console.log(result);
    return result;
}

export function ObjectToArray(groups_to_categories) {
    console.log(groups_to_categories);
    const result = Object.entries(groups_to_categories).map(entry => {
        return {
            group_id: parseInt(entry[0]),
            category_id: parseInt(entry[1])
        }
    });
    console.log(result);
    return result;
}

export function ArrayToDescriptionArray(groups_to_categories, groups, categories) {
    console.log(groups_to_categories);
    const result = groups_to_categories
        .map(info => {
            return {
                group_id: info.group_id,
                group_description: groups.find(gr => gr.group_id === info.group_id).description,
                category_id: info.category_id,
                category_description: categories.find(cat => cat.category_id === info.category_id).description,
            }
        });
    console.log(result);
    return result;
}