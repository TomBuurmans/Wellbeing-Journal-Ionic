// Includes the code from all the services user, auth, and ethree.

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { EThree } from '@virgilsecurity/e3kit';

@Injectable()
export class AbstractService {

  public eThree;

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afFunction: AngularFireFunctions
   ) {}

  // user service
  getCurrentUser() {
    console.log('get user');
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.authState.subscribe((u) => {
        if (u) {
          // this.virgilInit();
          resolve(u);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.auth.currentUser;
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
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.virgilInit().then(async () => {
          resolve(res);
          const user = this.afAuth.auth.currentUser;
          // register user with virgil
          await this.eThree.register();
          this.eThree.backupPrivateKey(user.uid)
          .then(() => console.log('key backup success'))
          .catch(e => console.error('error: ', e));
          // set up firestore user document and logs collection
          this.afAuth.auth.currentUser.updateProfile({ displayName: value.name });
          this.db.collection('users').doc(user.uid).collection('logs');
        });
      }, err => reject(err));
    });
  }

  doLogin(value: { email: string; password: string; }) {
    console.log('login');
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
      .then(async res => {
        this.virgilInit().then(async () => {
          this.eThree.hasLocalPrivateKey().then(hasLocalPrivateKey => {
            if (!hasLocalPrivateKey) {this.eThree.restorePrivateKey(res.user.uid); }
        });
        });
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.auth.currentUser) {
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
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.authState.subscribe(async (u) => {
        if (u) {
          const getToken = this.afFunction.functions.httpsCallable('getVirgilJwt');
          const initializeFunction = () => getToken().then(result => result.data.token);
          await EThree.initialize(initializeFunction).then(async eThree => {
              // Initialize done
              // Save the eThree instance
              console.log('init e3');
              this.eThree = eThree;
          }).catch(error => {
              // Error handling
              const code = error.code;
          });
          resolve(u);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  async encrypt(userId, text) {
    const publicKeys = await this.eThree.lookupPublicKeys(userId);
    const encrypted = await this.eThree.encrypt(text);
    return encrypted;
  }

  async decrypt(userId, text) {
    const publicKey = await this.eThree.lookupPublicKeys(userId);
    const decrypted = await this.eThree.decrypt(text, publicKey);
    return decrypted;
  }
  // end ethree service
}
