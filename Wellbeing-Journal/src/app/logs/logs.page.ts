import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { OverlayBaseController } from '@ionic/angular/dist/util/overlay';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

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
  substanceUse: string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  @ViewChild('loading', { read: ElementRef }) searchElementRef: ElementRef;
  private selectedItem: any;
  private userId;
  public logs: Array<Log> = [];
  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth, public loadingController: LoadingController,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.afAuth.authState.subscribe( user => {
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
        this.searchElementRef.nativeElement.style.display = 'none';
      });
    });
  }

  ngOnInit() {
  }

  clickLog(item) {
    console.log(item);
    const navigationExtras: NavigationExtras = {
      state: {
        log: item
      }
    };
    this.router.navigate(['log'], navigationExtras);
  }

}
