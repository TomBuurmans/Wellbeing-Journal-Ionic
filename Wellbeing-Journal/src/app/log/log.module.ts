import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconService } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';

import { IonicModule } from '@ionic/angular';

import { LogPage } from './log.page';

const routes: Routes = [
  {
    path: '',
    component: LogPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FontAwesomeModule
  ],
  declarations: [LogPage]
})
export class LogPageModule {
  constructor(private faIconService: FaIconService) {
    this.faIconService.defaultPrefix = 'far';
    library.add(far);
  }
}
