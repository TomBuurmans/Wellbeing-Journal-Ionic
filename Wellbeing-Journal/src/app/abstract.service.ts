// Includes the code from all the services user, auth, and ethree.

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
require('firebase/functions');
import { EThree } from '@virgilsecurity/e3kit';

@Injectable()
export class AbstractService {

  public eThree;

  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth
  ) {
  }

  // user service
  getCurrentUser() {
    console.log('get user');
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().onAuthStateChanged((u) => {
        if (u) {
          this.virgilInit().then(async () => {
            // test encrypt
            console.log(this.eThree);
          });
          resolve(u);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name
      }).then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }
  // end user service

  // auth service
  doRegister(value: { email: string; name: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        console.log(res);
        this.virgilInit().then(() => {
          console.log(res);
          resolve(res);
          const user = firebase.auth().currentUser;
          // register user with virgil
          this.eThree.register();
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
        this.virgilInit().then(async () => {
          console.log(this.eThree);
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
  // end auth service

  // ethree service
  async virgilInit() {
    const getToken = firebase.functions().httpsCallable('getVirgilJwt');
    const initializeFunction = () => getToken().then(result => result.data.token);
    await EThree.initialize(initializeFunction).then(async eThree => {
        // Initialize done
        // Save the eThree instance
        this.eThree = eThree;
        console.log(this.eThree);
        // const e = await this.encrypt(firebase.auth().currentUser.uid, 'test');
        // const d = await this.decrypt(firebase.auth().currentUser.uid, e);
    }).catch(error => {
        // Error handling
        const code = error.code;
        // code === 'unauthenticated' if user not authenticated
    });
  }

  async encrypt(userId, text) {
    console.log('encrypt');
    console.log(text);
    const publicKeys = await this.eThree.lookupPublicKeys(userId);
    const encrypted = await this.eThree.encrypt(text);
    console.log(encrypted);
    return encrypted;
  }

  async decrypt(userId, text) {
    console.log('decrypt');
    console.log(text);
    const publicKey = await this.eThree.lookupPublicKeys(userId);
    const decrypted = await this.eThree.decrypt(text, publicKey);
    console.log(decrypted);
    return decrypted;
  }
  // end ethree service
}
