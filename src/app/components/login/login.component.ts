import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import { loginMessages } from 'src/app/helpers/validationmsgs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage!: string;
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

    this.loginForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.logValidationErrors(this.loginForm);
    });
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
  }

  // submit to backend
  logInUser(): void {
    this.progressBarService.startLoading();
    this.auth.getUsers().subscribe(
      (users) => {
        const user = users.find(
          (u) =>
            this.loginForm.value.email === u.email &&
            this.loginForm.value.password === u.password
        );
        if (user) {
          this.auth.changeCurrentUser(user);
          this.success();
          this.loginForm.reset();
        } else {
          this.error('');
        }
      },
      (error) => this.error(error)
    );
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
    this.progressBarService.setShowSuccess();
    setTimeout(() => {
      this.progressBarService.setShowDefaults();
      this.router.navigate(['/home']);
    }, 4000);
  }

  error(message: string): void {
    this.progressBarService.setError();
    this.progressBarService.setShowError();
    this.progressBarService.completeLoading();
    setTimeout(() => this.progressBarService.setShowDefaults(), 4000);
    console.log(message);
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
}
