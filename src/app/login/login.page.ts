import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationExtras, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const username = form.value.username;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        user: username
      }
    };
    this.router.navigate(['/home'], navigationExtras);
  }
}
