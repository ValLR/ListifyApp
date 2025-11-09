import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  user = {
    username: ''
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'usuario': this.user.username
      }
    }
    this.router.navigate(['/home'], navigationExtras);
  };
}
