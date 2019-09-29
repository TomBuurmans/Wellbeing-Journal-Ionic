import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  userId;

  constructor(
    public userService: AbstractService,
    public authService: AbstractService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private elRef: ElementRef,
    private alertController: AlertController
  ) {

  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      header: 'Caution',
      message: 'This will delete all of your log entries',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'DELETE DATA',
          handler: () => {
            console.log('Confirm');
            this.deleteData();
          }
        }
      ]
    });
    await alert.present();
  }

  deleteData() {
    console.log('Deleting data');
    const userDoc = this.db.firestore.collection('users').doc(this.userId).collection('logs');
    userDoc.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc);
          this.db.doc(doc.ref).delete();
        });
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      const data = routeData.data;
      if (data) {
        this.user = data;
        // this.createForm(this.user.name);
        this.afAuth.authState.subscribe( user => {
          if (user) { this.userId = user.uid; }
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.doLogout()
    .then((res) => {
      this.router.navigate(['/login']);
    }, (error) => {
      console.log('Logout error', error);
    });
  }
}
