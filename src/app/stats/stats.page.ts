import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { AbstractService } from '../abstract.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

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
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  @ViewChild('chart', { read: ElementRef }) searchElementRef: ElementRef;
  chart: Chart;
  userId;
  public logs: Array<Log> = [];
  public monthlyLogOverallSum: Array<Array<number>> = [[]];
  public monthlyLogCount: Array<Array<number>> = [[]];
  public years: Array<string> = [];

  constructor(public e3Service: AbstractService,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    if (this.e3Service) {
      this.getLogs();
      this.createChart();
    } else {
      this.e3Service.virgilInit().then(() => {
        this.getLogs();
        this.createChart();
      });
    }
  }

  getLogs() {
    this.afAuth.auth.onAuthStateChanged(async user => {
      if (user) {
        this.userId = user.uid;
        const userDoc = this.db.collection('users').doc(this.userId).collection('logs');
        userDoc.get().toPromise().then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            // console.log(doc.id, '=>', doc.data());
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
            console.log(this.logs.length);
            this.setChartData();
          });
        });
      }
    });
  }

  setChartData() {
    console.log('set data');
    let yearCount = -1;
    for (const i of this.logs) {
      console.log(i);
      const date = i.date.split('-');
      if (!this.years.includes(date[2]) && yearCount <= 3) {
        yearCount++;
        this.years.push(date[2]);
        this.monthlyLogCount[yearCount] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.monthlyLogOverallSum[yearCount] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
      }

      for (let y = 0; y < this.years.length; y++) {
        if (date[2] === this.years[y]) {
          this.monthlyLogCount[y][parseInt(date[1], 10) - 1]++;
          this.monthlyLogOverallSum[y][parseInt(date[1], 10) - 1] += parseInt(i.overall, 10);
        }
      }
    }
    for (let y = 0; y < this.years.length; y++) {
      const color = this.getRandomColor();
      const dataset = {
        label: this.years[y],
        fill: false,
        borderColor: color,
        backgroundColor: color,
        data: []
      };
      for (let i = 0; i < this.monthlyLogCount[y].length; i++) {
        dataset.data.push((this.monthlyLogOverallSum[y][i] / this.monthlyLogCount[y][i]));
      }
      this.chart.data.datasets.push(dataset);
      this.chart.update();
      console.log(dataset);
    }
  }

  createChart() {
    const ctx = this.searchElementRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: []
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              max: 3,
              min: 0,
              stepSize: 1,
              fontFamily: 'FontAwesome',
              fontSize: 30,
              callback: function(value, index, values) {
                if (value === 1) {
                  return '\uf119';
                } else if (value === 2) {
                  return '\uf11a';
                } else if (value === 3) {
                  return '\uf118';
                }
              }
            },
          }]
        }
      }
    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
