import { Component } from '@angular/core';
import { GlobalProvider } from '../app.module';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public global: GlobalProvider, public alertController: AlertController) {
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Welcome!',
      message: 'Welcome to SWEN 325 App, Dear ' + this.global.name + '!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
