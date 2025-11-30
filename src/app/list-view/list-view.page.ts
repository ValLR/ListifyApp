import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { ShoppingList } from '../models/shopping.models';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListViewPage implements OnInit {

  list: ShoppingList = { id: '', name: '', items: [] };
  listId: string | null = '';
  newItem: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    
    if (this.listId) {
      this.loadFromBackup(this.listId);
      
      this.shoppingListService.getList(this.listId).subscribe({
        next: (data) => {
          this.list = data;
          this.updateLocalBackup(); 
        },
        error: () => {
          console.log("Sin conexión: Manteniendo datos locales");
          this.presentToast('Sin conexión: Usando copia local');
        }
      });
    }
  }

  loadFromBackup(id: string) {
    const backup = localStorage.getItem('backup_lists');
    if (backup) {
      const allLists: ShoppingList[] = JSON.parse(backup);

      const foundList = allLists.find(l => l.id === id);
      if (foundList) {
        this.list = foundList;
      }
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: 'warning' });
    toast.present();
  }

  addItem() {
    if (this.newItem.trim().length > 0) {
      if (!this.list.items) { this.list.items = []; }
      
      this.list.items.push({
        name: this.newItem,
        checked: false
      });
      this.newItem = '';
      this.autoSave();
    }
  }

  autoSave() {
    this.updateLocalBackup();

    if (this.listId && this.list) {
      this.shoppingListService.updateList(this.listId, this.list).subscribe({
        next: () => console.log('Sincronizada con API'),
        error: () => {
            console.log('Error API, guardando localmente');
            this.updateLocalBackup();
        }
      });
    }
  }

  updateLocalBackup() {
      const backup = localStorage.getItem('backup_lists');
      if (backup) {
          let allLists: ShoppingList[] = JSON.parse(backup);
          const index = allLists.findIndex(l => l.id === this.listId);
          if (index > -1) {
              allLists[index] = this.list;
              localStorage.setItem('backup_lists', JSON.stringify(allLists));
          }
      }
  }

  deleteItem(index: number) {
    this.list.items.splice(index, 1);
    this.autoSave();
  }

  onCheckboxChange() {
    this.autoSave();
  }

  async onSaveClick() {
    this.autoSave();
    this.presentSaveAlert();
  }

  async presentSaveAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Guardado ;)',
      message: 'Tu lista "' + this.list.name + '" ha sido guardada.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
