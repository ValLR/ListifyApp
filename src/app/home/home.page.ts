import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping.models';
import { ShoppingListService } from '../services/shopping-list';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
})

export class HomePage implements OnInit {
  @ViewChild('animatedMainTitle', { read: ElementRef }) animatedMainTitle!: ElementRef;
  @ViewChild('animatedMenu', { read: ElementRef }) animatedMenu!: ElementRef;
  @ViewChild('emptyIcon', { read: ElementRef }) emptyIcon!: ElementRef;
  @ViewChild('emptyText', { read: ElementRef }) emptyText!: ElementRef;

  user: string = '';
  shoppingLists: ShoppingList[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private shoppingListService : ShoppingListService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.user = params['user'];
      }
    });
  }

  ionViewWillEnter() {
    this.loadLists();
  }

  loadLists() {
    this.shoppingListService.getLists().subscribe({
      next: (res) => {
        console.log("Listas cargadas desde API");
        const listsWithPhotos = this.preserveLocalPhotos(res);
        this.shoppingLists = listsWithPhotos;
        localStorage.setItem('backup_lists', JSON.stringify(this.shoppingLists));
      },
      error: () => {
        const backup = localStorage.getItem('backup_lists');
        if (backup) { this.shoppingLists = JSON.parse(backup); }
      }
    });
  }

  preserveLocalPhotos(apiLists: ShoppingList[]): ShoppingList[] {
    const backup = localStorage.getItem('backup_lists');
    if (!backup) return apiLists;

    const localLists: ShoppingList[] = JSON.parse(backup);

    return apiLists.map(apiList => {
      const localList = localLists.find(l => l.id === apiList.id);
      
      if (localList && localList.items) {
        apiList.items = apiList.items.map((apiItem, index) => {
          const localItem = localList.items[index];
          if (localItem && localItem.image) {
            apiItem.image = localItem.image;
          }
          return apiItem;
        });
      }
      return apiList;
    });
  }

  async createNewList() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Lista',
      inputs: [{ name: 'nombre', type: 'text', placeholder: 'Ej: Compra Mensual' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.nombre && data.nombre.trim().length > 0) {
              this.addListToApi(data.nombre.trim());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addListToApi(name: string) {
    const capitalizedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const newList = {
      name: capitalizedName,
      items: []
    };

    this.shoppingListService.createList(newList).subscribe(res => {
      this.shoppingLists.push(res);
      this.updateLocalBackup();
      
      this.goToList(res.id); 
      this.presentToast('Lista creada exitosamente');
    });
  }

  deleteList(index: number) {
    const list = this.shoppingLists[index];
    this.shoppingListService.deleteList(list.id).subscribe({
      next: () => {
        this.shoppingLists.splice(index, 1);
        this.updateLocalBackup(); 
        this.presentToast('Lista eliminada');
      },
      error: () => {
        this.presentToast('Fallo al conectar: No se puede eliminar sin conexión.');      }
    });
  }

  updateLocalBackup() {
    localStorage.setItem('backup_lists', JSON.stringify(this.shoppingLists));
  }

  goToList(listId: string) {
    this.router.navigate(['/list-view', listId]);
  }

  goToProfile() {
    this.router.navigate(['/profile'], {
      queryParams: { user: this.user }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

  ionViewDidEnter() {
    if (this.animatedMainTitle) {
      const titleAnimation = this.animationCtrl.create()
        .addElement(this.animatedMainTitle.nativeElement)
        .duration(1000)
        .fromTo('transform', 'translateY(100px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1');
      titleAnimation.play();
    }

    if (this.animatedMenu) {
      const menuAnimation = this.animationCtrl.create()
        .addElement(this.animatedMenu.nativeElement)
        .duration(1500)
        .fromTo('opacity', '0', '1');
      menuAnimation.play();
    }

    if (this.emptyIcon && this.emptyText) {      
      const iconAnimation = this.animationCtrl.create()
        .addElement(this.emptyIcon.nativeElement)
        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'scale(1) rotate(0deg)' },
          { offset: 0.3, transform: 'scale(1.2) rotate(10deg)' },
          { offset: 0.6, transform: 'scale(1.2) rotate(-10deg)' },
          { offset: 1, transform: 'scale(1) rotate(0deg)' }
        ]);
        
      const textAnimation = this.animationCtrl.create()
        .addElement(this.emptyText.nativeElement)
        .duration(1000)
        .fromTo('opacity', '0', '1');

      iconAnimation.play();
      textAnimation.play();
    }
  }
}
