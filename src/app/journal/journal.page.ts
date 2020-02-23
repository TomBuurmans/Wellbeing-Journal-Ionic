import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
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
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {

  @ViewChild('loading', { read: ElementRef }) searchElementRef: ElementRef;
  private selectedItem: any;
  private userId;
  public logs: Array<Log> = [];
  constructor(public loadingController: LoadingController, public db: AngularFirestore, public afAuth: AngularFireAuth,
              private router: Router, public e3Service: AbstractService) {
  }

  ngOnInit() {
    console.log(this.e3Service.eThree);
    if (this.e3Service.eThree) {
      this.loadJournal();
    } else {
      this.e3Service.virgilInit().then(() => {
        this.loadJournal();
      });
    }
  }

  loadJournal() {
    this.afAuth.auth.onAuthStateChanged(async user => {
      if (user) { this.userId = user.uid; }
      // await this.e3Service.virgilInit();
      const userDoc = this.db.collection('users').doc(this.userId).collection('logs');
      userDoc.get().toPromise().then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          // console.log(doc.id, '=>', doc.data());
          await this.logs.push({
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
      }).then(() => {
        // hide loading spinner
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
    this.router.navigate(['entry'], navigationExtras);
  }

}
