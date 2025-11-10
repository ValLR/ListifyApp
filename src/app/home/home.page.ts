import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, Animation } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})

export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('animatedMainTitle', { read: ElementRef }) animatedMainTitle!: ElementRef;
  @ViewChild('animatedMenu', { read: ElementRef }) animatedMenu!: ElementRef;

  usuario: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['usuario']) {
        this.usuario = params['usuario'];
      }
    });
  }

  ngAfterViewInit() {
    const titleAnimation = this.animationCtrl.create()
      .addElement(this.animatedMainTitle.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateY(100px)', 'translateY(0px)')
      .fromTo('opacity', '0', '1');
    
    const menuAnimation = this.animationCtrl.create()
      .addElement(this.animatedMenu.nativeElement)
      .duration(1500)
      .fromTo('opacity', '0', '1')
    
    titleAnimation.play();
    menuAnimation.play();
  }

  goToList(listId: string) {
    this.router.navigate(['/list-view'], {
      queryParams: { 'id': listId }
    });
  }
}
