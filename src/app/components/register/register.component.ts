import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import { registerMessages } from 'src/app/helpers/validationmsgs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage!: string;
  validationMessages: any = registerMessages;

  formErrors: any = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirm: '',
  };

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public progressBarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.registerForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.logValidationErrors(this.registerForm);
    });
  }

  // create form
  createForm(): void {
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.minLength(6), Validators.email],
      ],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(100),
            ],
          ],
          confirm: ['', Validators.required],
        },
        { validator: this.matchingPasswords }
      ),
    });
  }

  // submit to backend
  registerUser(): void {
    this.progressBarService.startLoading();
    const {
      name,
      surname,
      email,
      passwordGroup: { password },
    } = this.registerForm.value;

    const userToRegister = { id: null, name, surname, email, password };

    this.auth.registerUser(userToRegister).subscribe(
      (user) => {
        this.success();
        this.auth.changeCurrentUser(user);
      },
      (error) => this.error(error)
    );
  }

  matchingPasswords(c: AbstractControl): { [key: string]: boolean } | null {
    const email = c.get('password');
    const confirm = c.get('confirm');

    if (email?.pristine || confirm?.pristine) {
      return null;
    }

    if (email?.value === confirm?.value) {
      return null;
    }
    return { matching: true };
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.setShowSuccess();
    this.progressBarService.completeLoading();
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

  logValidationErrors(group: FormGroup = this.registerForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
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
      }
    });
  }
}
