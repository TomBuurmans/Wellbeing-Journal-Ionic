import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  private selectedItem: any;
  public items: Array<{ title: string; note: string }> = [];
  constructor() {
    for (let i = 1; i < 11; i++) {
      this.items.push( {
        title: 'Item ' + i,
        note: 'This is item #' + i
      });
    }
  }

  ngOnInit() {
  }

}
