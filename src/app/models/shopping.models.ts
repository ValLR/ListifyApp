export interface ShoppingItem {
  name: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
}
