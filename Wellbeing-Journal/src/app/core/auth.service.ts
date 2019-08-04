import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
 ) {}

  // doGoogleLogin() {
  //   return new Promise<any>((resolve, reject) => {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     });
  //   });
  // }

  doRegister(value: { email: string; name: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
        const user = firebase.auth().currentUser;
        this.db.collection('users').doc(user.uid).set({
          name: value.name
        });
      }, err => reject(err));
    });
  }

  doLogin(value: { email: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }


}
