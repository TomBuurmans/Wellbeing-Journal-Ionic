import { Component } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: '';
  successMessage = '';

  constructor(
    public userService: AbstractService,
    public authService: AbstractService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
   }

   createForm() {
     this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       name: ['', Validators.required],
       password: ['', Validators.required]
     });
   }

   tryRegister(value) {
     this.authService.doRegister(value)
     .then(res => {
      //  console.log(res);
       this.errorMessage = '';
       this.successMessage = 'Your account has been created';
       this.sendName(value);
       this.router.navigate(['/home']);
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
   }

   sendName(value) {
    console.log(value);
    this.userService.updateCurrentUser(value)
      .then(res => {
        console.log(res);
      }, err => console.log(err));
   }

}
