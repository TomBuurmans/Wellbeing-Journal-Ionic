import { Component, NgModule } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: '';

  constructor(
    public authService: AbstractService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  // tryGoogleLogin() {
  //   this.authService.doGoogleLogin()
  //   .then(res => {
  //     this.router.navigate(['/home']);
  //   });
  // }

  tryLogin(value) {
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }
}
