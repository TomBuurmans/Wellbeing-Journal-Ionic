// DEPRECATED: NOW INCLUDED IN ABSTRACT SERVICE

// import * as firebase from 'firebase/app';
// require('firebase/functions');
// import { EThree } from '@virgilsecurity/e3kit';
// import { Injectable } from '@angular/core';

// @Injectable()
// export class EthreeService {

//   public eThree;

//   constructor() {
//   }

//   async virgilInit() {
//     const getToken = firebase.functions().httpsCallable('getVirgilJwt');
//     const initializeFunction = () => getToken().then(result => result.data.token);
//     await EThree.initialize(initializeFunction).then(eThree => {
//         // Initialize done
//         // Save the eThree instance
//         this.eThree = eThree;
//         console.log(this.eThree);
//     }).catch(error => {
//         // Error handling
//         const code = error.code;
//         // code === 'unauthenticated' if user not authenticated
//     });
//   }

// }
