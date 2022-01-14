import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  displayCustomMessage,
  displayMessage,
} from 'src/app/helpers/helperFuncs';
import { Subscription } from 'rxjs';
import { Seller } from 'src/app/models/user.model';
import { SellerService } from 'src/app/services/seller.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  errorMessage!: string;
  validationMessages: any = registerMessages;
  sub!: Subscription;

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
    private sellerService: SellerService,
    public progressBarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
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
      isLocked: ['unlock'],
    });

    this.sub = this.registerForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.logValidationErrors(this.registerForm);
      });
  }

  // submit to backend
  registerUser(): void {
    if (this.registerForm.invalid) {
      displayCustomMessage('Please complete the required fields');
      return;
    }

    this.progressBarService.startLoading();
    const {
      name,
      surname,
      email,
      passwordGroup: { password },
      isLocked,
    } = this.registerForm.value;

    const userToRegister = {
      id: null,
      name,
      surname,
      email,
      password,
      isLocked,
    };

    const seller: Seller = {
      id: null,
      seller: name,
      email,
    };

    this.sub = this.sellerService.addSeller(seller).subscribe();

    this.sub = this.auth.registerUser(userToRegister).subscribe(
      (user) => {
        this.success();
        const tempUser = { ...user, password: '' };
        this.auth.changeCurrentUser(tempUser);
      },
      () => {
        this.error();
      }
    );
  }

  matchingPasswords(c: AbstractControl): { [key: string]: boolean } | null {
    const password = c.get('password');
    const confirm = c.get('confirm');

    if (password?.pristine || confirm?.pristine) {
      return null;
    }

    if (password?.value === confirm?.value) {
      return null;
    }
    return { matching: true };
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
    displayMessage('success', 'Registered successfully!');
    this.router.navigate(['/home']);
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage(
      'error',
      'Oops something went wrong! Try to register again',
      2000
    );
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
