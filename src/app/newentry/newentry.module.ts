import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';

import { IonicModule } from '@ionic/angular';

import { NewEntryPage } from './newentry.page';

const routes: Routes = [
  {
    path: '',
    component: NewEntryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FontAwesomeModule
  ],
  declarations: [NewEntryPage]
})
export class NewEntryPageModule {
  constructor() {
    library.add(far);
  }
}
