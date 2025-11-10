import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { ShoppingItem, ShoppingList } from '../models/shopping.models';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListViewPage implements OnInit {

  list!: ShoppingList;
  listId: string = '';
  newItem: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.listId = params['id'];
        this.list = this.shoppingListService.getList(this.listId);
      }
    })
  }

  addItem() {
    if (this.newItem.trim().length > 0) {
      this.list.items.push({
        name: this.newItem,
        checked: false
      });
      this.newItem = '';
      this.autoSave();
    }
  }

  autoSave() {
    this.shoppingListService.savelist(this.list);
  }

  deleteItem(index: number) {
    this.list.items.splice(index, 1);
    this.saveList();
  }

  onCheckboxChange() {
    this.saveList();
  }

  async saveList() {
    this.shoppingListService.savelist(this.list);
    this.presentSaveAlert();
  }

  async onSaveClick() {
    this.autoSave();
    this.presentSaveAlert();
  }

  async presentSaveAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Guardado ;)',
      message: 'Tu lista "' + this.list.id + '" ha sido guardada.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
