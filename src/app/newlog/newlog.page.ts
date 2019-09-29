import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, Params } from '@angular/router';
import { AbstractService } from '../abstract.service';

@Component({
  selector: 'app-newlog',
  templateUrl: './newlog.page.html',
  styleUrls: ['./newlog.page.scss'],
})
export class NewlogPage implements OnInit {

  logForm: FormGroup;
  userId;

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertController: AlertController,
              public e3Service: AbstractService,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth
    ) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) { this.userId = user.uid; }
    });
    }

  createForm() {
    this.logForm = this.fb.group({
      anger: ['', Validators.required ],
      disgust: ['', Validators.required ],
      fear: ['', Validators.required ],
      joy: ['', Validators.required ],
      sadness: ['', Validators.required ],
      overall: ['', Validators.required ],
      use: ['', Validators.required ],
      notes: ['']
    });
  }

  async addLog() {
    const value = this.logForm.value;
    const user = this.afAuth.auth.currentUser;

    await this.e3Service.virgilInit();
    const item = {
      emotionLevel: {
        anger: await this.e3Service.encrypt(this.userId, value.anger),
        disgust: await this.e3Service.encrypt(this.userId, value.disgust),
        fear: await this.e3Service.encrypt(this.userId, value.fear),
        joy: await this.e3Service.encrypt(this.userId, value.joy),
        sadness: await this.e3Service.encrypt(this.userId, value.sadness)
      },
      overall: await this.e3Service.encrypt(this.userId, value.overall),
      substanceUse: await this.e3Service.encrypt(this.userId, value.use),
      // substanceUse: value.use,
      notes: await this.e3Service.encrypt(this.userId, value.notes)
    };
    const d = new Date();
    const s = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    console.log(s);
    this.db.collection('users').doc(user.uid).collection('logs').doc(s).set(item);
    this.router.navigate(['/logs']);
  }

  async checkOverwriteAlert() {
    const d = new Date();
    const s = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    const userDoc = this.db.collection('users').doc(this.userId).collection('logs').doc(s).get().toPromise().then(async docSnapshot => {
      if (docSnapshot.exists) {
        const alert = await this.alertController.create({
          header: 'Confirm',
          message: 'You have already made a log for today, this new entry will overwrite it',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Cancel');
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
      } else {
        this.addLog();
      }
    });
  }

  ngOnInit() {
    this.createForm();
  }

}
