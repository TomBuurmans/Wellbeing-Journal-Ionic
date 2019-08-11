import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { OverlayBaseController } from '@ionic/angular/dist/util/overlay';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AbstractService } from '../abstract.service';

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
export class LogsPage implements AfterViewInit {

  @ViewChild('loading', { read: ElementRef }) searchElementRef: ElementRef;
  private selectedItem: any;
  private userId;
  public logs: Array<Log> = [];
  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth, public loadingController: LoadingController,
              private router: Router, public e3Service: AbstractService) {
  }

  ngAfterViewInit() {
    this.afAuth.authState.subscribe(async user => {
      if (user) { this.userId = user.uid; }
      // console.log(this.userId);
      // console.log(this.db.collection('users').doc(this.userId).collection('logs').valueChanges());
      await this.e3Service.virgilInit();
      const userDoc = this.db.firestore.collection('users').doc(this.userId).collection('logs');
      userDoc.get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          console.log(doc.id, '=>', doc.data());
          this.logs.push({
            date: doc.id,
            emotionLevel: {
              anger: await this.e3Service.decrypt(this.userId, doc.data().emotionLevel.anger),
              disgust: await this.e3Service.decrypt(this.userId, doc.data().emotionLevel.disgust),
              fear: await this.e3Service.decrypt(this.userId, doc.data().emotionLevel.fear),
              joy: await this.e3Service.decrypt(this.userId, doc.data().emotionLevel.joy),
              sadness: await this.e3Service.decrypt(this.userId, doc.data().emotionLevel.sadness)
            },
            notes: await this.e3Service.decrypt(this.userId, doc.data().notes),
            overall: await this.e3Service.decrypt(this.userId, doc.data().overall),
            substanceUse: await this.e3Service.decrypt(this.userId, doc.data().substanceUse)
          });
        });
        this.searchElementRef.nativeElement.style.display = 'none';
      });
    });
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
