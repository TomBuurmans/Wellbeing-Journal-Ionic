import { Component } from '@angular/core';

import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { LocalNotifications, ELocalNotificationTriggerUnit,
//   ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  // scheduled = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public toastController: ToastController
    // private localNotifications: LocalNotifications,
    // public alertCtrl: AlertController
  ) {
    this.initializeApp();
    // this.platform.ready().then(() => {
    //   this.localNotifications.on('trigger').subscribe(res => {
    //     let msg = res.data ? res.data.mydata : '';
    //     this.showAlert(res.title, res.text, msg);
    //   });
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.repeatingDaily();
    });
  }

  // repeatingDaily() {
  //   this.localNotifications.schedule({
  //     id: 1,
  //     title: 'Daily Journal Reminder',
  //     text: 'A gentle reminder to input you daily journal entry!',
  //     trigger: { every: { hour: 0, minute: 1 } }
  //   });
  // }

  // showAlert(header, sub, msg) {
  //   this.alertCtrl.create({
  //     header: header,
  //     subHeader: sub,
  //     message: msg,
  //     buttons: ['Ok']
  //   }).then(alert => alert.present());
  // }
}
