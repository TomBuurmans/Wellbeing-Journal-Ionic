import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconService } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';

import { IonicModule } from '@ionic/angular';

import { EntryPage } from './entry.page';

const routes: Routes = [
  {
    path: '',
    component: EntryPage
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
  declarations: [EntryPage]
})
export class EntryPageModule {
  constructor(private faIconService: FaIconService) {
    this.faIconService.defaultPrefix = 'far';
    library.add(far);
  }
}
