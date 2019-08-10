import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Chart } from 'chart.js';

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
export class StatsPage implements AfterViewInit {

  @ViewChild('chart', { read: ElementRef }) searchElementRef: ElementRef;
  chart: Chart;
  userId;
  public logs: Array<Log> = [];
  public monthlyLogOverallSum: Array<Array<number>> = [[]];
  public monthlyLogCount: Array<Array<number>> = [[]];
  public years: Array<string> = [];

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
  }

  ngAfterViewInit(): void {
    this.getLogs();
    this.createChart();
  }

  getLogs() {
    let yearCount = -1;
    this.afAuth.authState.subscribe( user => {
      if (user) { this.userId = user.uid; }
      console.log(this.userId);
      console.log(this.db.collection('users').doc(this.userId).collection('logs').valueChanges());
      const userDoc = this.db.firestore.collection('users').doc(this.userId).collection('logs');
      userDoc.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, '=>', doc.data());
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
          const date = doc.id.split('-');
          if (!this.years.includes(date[2])) {
            yearCount++;
            this.years.push(date[2]);
            this.monthlyLogCount[yearCount] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            this.monthlyLogOverallSum[yearCount] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
          }

          for (let y = 0; y < this.years.length; y++) {
            if (date[2] === this.years[y]) {
              this.monthlyLogCount[y][parseInt(date[1], 10) - 1]++;
              this.monthlyLogOverallSum[y][parseInt(date[1], 10) - 1] += parseInt(doc.data().overall, 10);
            }
          }
        });
        console.log(this.years);
        console.log(this.monthlyLogOverallSum);
        console.log(this.monthlyLogCount);
        this.setChartData();
      });
    });
  }

  setChartData() {
    console.log('set data');
    for (let y = 0; y < this.monthlyLogCount.length; y++) {
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
