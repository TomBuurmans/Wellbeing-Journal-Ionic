import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit{

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  userId;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore
  ) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      const data = routeData.data;
      if (data) {
        this.user = data;
        // this.createForm(this.user.name);
        const btn = document.getElementById('deleteData');
        btn.addEventListener('click', () => {
          this.afAuth.authState.subscribe( user => {
            if (user) { this.userId = user.uid; }
            console.log(this.userId);
            console.log(this.db.collection('users').doc(this.userId).collection('logs').valueChanges());
            const userDoc = this.db.firestore.collection('users').doc(this.userId).collection('logs');
            let batch = this.db.batch();
            userDoc.get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.
              });
              document.getElementById('loading').style.display = 'none';
            });
          });
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log('Logout error', error);
    });
  }
}
