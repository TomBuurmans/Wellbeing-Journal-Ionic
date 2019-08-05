import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router, Params } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-newlog',
  templateUrl: './newlog.page.html',
  styleUrls: ['./newlog.page.scss'],
})
export class NewlogPage implements OnInit {

  logForm: FormGroup;

  constructor(private fb: FormBuilder,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private router: Router,
              public alertController: AlertController
    ) {
    this.createForm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.addLog();
          }
        }
      ]
    });

    await alert.present();
  }

  createForm() {
    this.logForm = this.fb.group({
      anger: ['', Validators.required ],
      disgust: ['', Validators.required ],
      fear: ['', Validators.required ],
      joy: ['', Validators.required ],
      sadness: ['', Validators.required ],
      // surprise: ['', Validators.required ],
      overall: ['', Validators.required ],
      use: ['', Validators.required ],
      notes: ['']
    });
  }

  addLog() {
    const value = this.logForm.value;
    const user = firebase.auth().currentUser;
    const item = {
      emotionLevel: {
        anger: value.anger,
        disgust: value.disgust,
        fear: value.fear,
        joy: value.joy,
        sadness: value.sadness
      },
      overall: value.overall,
      substanceUse: value.use,
      notes: value.notes
    };
    const d = new Date();
    const s = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    console.log(s);
    this.db.collection('users').doc(user.uid).collection('logs').doc(s).set(item);
    this.router.navigate(['/logs']);
  }

  ngOnInit() {
    const button = document.querySelector('ion-button');
    button.addEventListener('click', this.presentAlertConfirm);
  }

}
