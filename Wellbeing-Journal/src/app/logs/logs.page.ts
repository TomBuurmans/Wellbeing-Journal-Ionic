import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { OverlayBaseController } from '@ionic/angular/dist/util/overlay';
import { LoadingController } from '@ionic/angular';

export interface Log {
  date: string;
  emotionLevel: {
    anger: string,
    disgust: string,
    fear: string,
    joy: string,
    sadness: string
  };
  notes: string;
  overall: string;
  substanceUse: boolean;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  private selectedItem: any;
  private userId;
  public logs: Array<Log> = [];
  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth, public loadingController: LoadingController) {
    afAuth.authState.subscribe( user => {
      if (user) { this.userId = user.uid; }
      console.log(this.userId);
      console.log(this.db.collection('users').doc(this.userId).collection('logs').valueChanges());
      const userDoc = this.db.firestore.collection('users').doc(this.userId).collection('logs');
      userDoc.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
          this.logs.push({
            date: doc.id,
            emotionLevel: {
              anger: doc.data().emotionLevel.anger,
              disgust: doc.data().emotionLevel.disgust,
              fear: doc.data().emotionLevel.fear,
              joy: doc.data().emotionLevel.joy,
              sadness: doc.data().emotionLevel.sadness
            },
            notes: doc.data().notes,
            overall: doc.data().overall,
            substanceUse: doc.data().substanceUse
          });
        });
        document.getElementById('loading').style.display = 'none';
      });
    });
    // for (let i = 1; i < 11; i++) {
    //   this.items.push( {
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i
    //   });
    // }
  }

  ngOnInit() {
  }

}
