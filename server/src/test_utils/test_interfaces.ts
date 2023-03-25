export interface SimpleGroupInterface {
  group_id: number,
  description: string,
}

export interface SimpleCategoryInterface {
  category_id: number,
  description: string,
}

export interface SimpleSpendingInterface {
  spending_id: number,
  description: string,
  value: number,
  currency: string,
  date: number,
}

export interface GroupInfo extends SimpleGroupInterface {
  group_id: number,
  description: string,
  categories: SimpleCategoryInterface []
}

export interface CategoryInfo extends SimpleCategoryInterface {
  category_id: number,
  description: string,
  group_id: number,
  group_description: string,
  spendings: SimpleSpendingInterface []
}

export interface SpendingInfo extends SimpleSpendingInterface {
  spending_id: number,
  description: string,
  value: number,
  currency: string,
  date: number,
  categories: {
    category_id: number,
    category_description: string,
    group_id: number,
    group_description: string,
  }[]
}
