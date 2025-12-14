import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbserviceService } from '../services/dbservice';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  user: string = '';
  totalLists: number = 0;
  totalItems: number = 0;
  lastListId: string = 'Ninguna';
  profileImage: string | undefined;

  latitude: number | null = null;
  longitude: number | null = null;
  loadingGeo: boolean = false;

  constructor(
    private router: Router,
    private dbService: DbserviceService
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('usuario') || 'Invitado';

    this.dbService.dbState().subscribe((isReady) => {
      if (isReady) {
        this.dbService.fetchShoppingLists().subscribe(lists => {
          this.totalLists = lists.length;
          this.totalItems = lists.reduce((acc, list) => acc + (list.items ? list.items.length : 0), 0);
          if (lists.length > 0) {
            this.lastListId = lists[lists.length - 1].name;
          }
        });
      this.loadUserProfile();
      }
    });
  }

  loadUserProfile() {
    this.dbService.getUser(this.user).then((userData) => {
      if (userData && userData.image) {
        this.profileImage = userData.image;
      }
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 40,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      this.profileImage = image.dataUrl;
      if (image.dataUrl) {
        await this.dbService.updateUserImage(this.user, image.dataUrl);
      }
    } catch (error) {
      console.log('No se tomó foto', error);
    }
  }

  async obtenerUbicacion() {
    this.loadingGeo = true;

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    } catch (error) {
      console.error('Error obteniendo ubicación', error);
      alert('Error al obtener ubicación. Asegúrate de tener el GPS activado.');
    } finally {
      this.loadingGeo = false;
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
