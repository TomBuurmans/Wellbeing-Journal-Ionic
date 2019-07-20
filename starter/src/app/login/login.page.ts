import { Component, OnInit } from '@angular/core';
import { GlobalProvider } from '../app.module';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  name = '';
  constructor(private routes: Router, private global: GlobalProvider) {}

  ngOnInit() {
  }

  async submitName() {
    this.global.name = this.name;
    this.routes.navigateByUrl('/tabs');
  }

}
