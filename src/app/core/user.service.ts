// DEPRECATED: NOW INCLUDED IN ABSTRACT SERVICE

// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
// import { EthreeService } from '../app.module';

// @Injectable()
// export class UserService {

//   constructor(
//    public db: AngularFirestore,
//    public afAuth: AngularFireAuth,
//    public e3Service: EthreeService
//   ) {
//   }

//   getCurrentUser() {
//     console.log('get user');
//     return new Promise<any>((resolve, reject) => {
//       const user = firebase.auth().onAuthStateChanged((u) => {
//         if (u) {
//           this.e3Service.virgilInit().then(async () => {
//             // test encrypt
//             console.log(this.e3Service.eThree);
//             const publicKeys = await this.e3Service.eThree.lookupPublicKeys(u.uid);
//             let encrypt = await this.e3Service.eThree.encrypt('blah', publicKeys);
//             console.log(encrypt);
//           });
//           resolve(u);
//         } else {
//           reject('No user logged in');
//         }
//       });
//     });
//   }

//   updateCurrentUser(value) {
//     return new Promise<any>((resolve, reject) => {
//       const user = firebase.auth().currentUser;
//       user.updateProfile({
//         displayName: value.name
//       }).then(res => {
//         resolve(res);
//       }, err => reject(err));
//     });
//   }
// }
