import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
})
export class EntryPage implements OnInit {

  @ViewChild('icon', { read: ElementRef }) searchElementRef: ElementRef;
  public log;
  public overallIcon;
  public overallIconStyle;
  public substanceIcon;
  public iconId;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state.log) {
        this.log = this.router.getCurrentNavigation().extras.state.log;
        console.log(this.log);
        this.setIcons();
      }
    });
  }

  setIcons() {
    if (this.log.overall === '3') {
      this.overallIcon = 'smile';
      document.body.style.setProperty('--icon-color', 'green');
    } else if (this.log.overall === '2') {
      this.overallIcon = 'meh';
      document.body.style.setProperty('--icon-color', 'orange');
    } else {
      this.overallIcon = 'frown';
      document.body.style.setProperty('--icon-color', 'red');
    }

    if (this.log.substanceUse === 'true') {
      this.substanceIcon = 'checkmark-circle';
    } else {
      this.substanceIcon = 'close-circle';
    }
  }

  ngOnInit() {
  }

}
