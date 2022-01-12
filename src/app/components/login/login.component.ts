import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import { loginMessages } from 'src/app/helpers/validationmsgs';
import {
  displayCustomMessage,
  displayMessage,
} from 'src/app/helpers/helperFuncs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage!: string;
  sub!: Subscription;

  validationMessages: any = loginMessages;

  formErrors: any = {
    email: '',
    password: '',
  };

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public progressBarService: ProgressbarService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.minLength(6), Validators.email],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ],
      ],
    });

    this.sub = this.loginForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.logValidationErrors(this.loginForm);
      });
  }

  // submit to backend
  logInUser(): void {
    if (this.loginForm.invalid) {
      displayCustomMessage('Please complete the required fields', 2000);
      return;
    }

    this.progressBarService.startLoading();
    this.sub = this.auth.getUsers().subscribe((users) => {
      const user = users.find(
        (u) =>
          this.loginForm.value.email === u.email &&
          this.loginForm.value.password === u.password
      );
      if (user) {
        const tempUser = { ...user, password: '' };
        this.auth.changeCurrentUser(tempUser);
        this.success();
        this.loginForm.reset();
      } else {
        this.error();
      }
    });
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
    this.router.navigate(['/home']);
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong! Try to login again');
  }

  logValidationErrors(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl?.dirty)
      ) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
