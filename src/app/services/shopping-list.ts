import { Injectable } from '@angular/core';
import { ShoppingList, ShoppingItem } from '../models/shopping.models'; // Importa tus tipos

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private shoppingLists: ShoppingList[] = [];

  constructor() { }

  getLists(): ShoppingList[] {
    return this.shoppingLists;
  }

  getList(id: string): ShoppingList {
    let list = this.shoppingLists.find(l => l.id === id);

    if (!list) {
      list = { id: id, items: [] };
      this.shoppingLists.push(list);
    }
    
    return list;
  }

  savelist(list: ShoppingList) {
    const index = this.shoppingLists.findIndex(l => l.id === list.id);
    if (index > -1) {
      this.shoppingLists[index] = list;
    }
  }
}
