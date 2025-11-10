import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListViewPageRoutingModule } from './list-view-routing.module';

import { ListViewPage } from './list-view.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListViewPageRoutingModule,
    ListViewPage,
    RouterModule,
  ],
})
export class ListViewPageModule {}
