import { Injectable, Inject } from '@angular/core';
import { EthreeService } from '../app.module';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public e3Service: EthreeService
 ) {}

  doRegister(value: { email: string; name: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        console.log(res);
        this.e3Service.virgilInit().then(() => {
          console.log(res);
          resolve(res);
          const user = firebase.auth().currentUser;
          // register user with virgil
          this.e3Service.eThree.register();
          // set up firestore user document and logs collection
          this.db.collection('users').doc(user.uid).set({
            name: value.name
          });
          this.db.collection('users').doc(user.uid).collection('logs');
        });
      }, err => reject(err));
    });
  }

  doLogin(value: { email: string; password: string; }) {
    console.log('login');
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.e3Service.virgilInit().then(async () => {
          // test encrypt
          console.log(this.e3Service.eThree);
          const publicKeys = await this.e3Service.eThree.lookupPublicKeys(res.user.uid);
          let encrypt = await this.e3Service.eThree.encrypt('blah', publicKeys);
          console.log(encrypt);
        });
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
