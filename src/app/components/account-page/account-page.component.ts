import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  displayCustomMessage,
  displayMessage,
} from 'src/app/helpers/helperFuncs';
import { registerMessages } from 'src/app/helpers/validationmsgs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

function getUserPassword(): string {
  const currentUser: User = JSON.parse(
    localStorage.getItem('currentUser') || '{}'
  );
  return currentUser.password;
}

const pass = getUserPassword();

function checkOldPassword(oldPass: string = pass): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value === oldPass) {
      return null;
    }
    return { matching: true };
  };
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css'],
})
export class AccountPageComponent implements OnInit, OnDestroy {
  accountForm!: FormGroup;
  errorMessage!: string;
  validationMessages: any = registerMessages;
  userId!: number | null;
  oldPassword!: string;
  sub!: Subscription;

  formErrors: any = {
    name: '',
    surname: '',
    email: '',
    oldPassword: '',
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
    this.getUserData();
    this.createForm();

    this.sub = this.accountForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.logValidationErrors(this.accountForm);
      });
  }

  getUserData(): void {
    this.progressBarService.startLoading();
    this.sub = this.auth.getCurrentUser().subscribe(
      (user: User) => {
        if (user) {
          this.userId = user.id;
          this.oldPassword = user.password;
          this.accountForm.patchValue({
            name: user.name,
            surname: user.surname,
            email: user.email,
            isLocked: user.isLocked,
          });
          this.success();
        }
      },
      (error) => {
        console.error('something went very wrong', error);
      }
    );
  }

  createForm(): void {
    this.accountForm = this.fb.group({
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
      oldPassword: ['', [Validators.required, checkOldPassword()]],
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
  }

  editUser(): void {
    if (this.accountForm.invalid) {
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
    } = this.accountForm.value;

    const user: User = {
      id: this.userId,
      name,
      surname,
      email,
      password,
      isLocked,
    };
    this.sub = this.auth.editUser(user).subscribe((user) => {
      this.auth.changeCurrentUser(user);
      this.success();
      displayMessage('success', 'Your account was edited successfully!');
    });
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
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong! Try again');
    this.router.navigate(['/home']);
  }

  logValidationErrors(group: FormGroup = this.accountForm): void {
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
