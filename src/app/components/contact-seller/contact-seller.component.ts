import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { contactMessages } from 'src/app/helpers/validationmsgs';
import { Ad, User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css'],
})
export class ContactSellerComponent implements OnInit {
  @Input() advert!: Ad;

  seller!: User;

  contactForm!: FormGroup;
  errorMessage!: string;
  validationMessages: any = contactMessages;

  formErrors: any = {
    name: '',
    email: '',
    message: '',
  };

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.getSellerInfo();
    this.createForm();

    this.contactForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.logValidationErrors(this.contactForm);
    });
  }

  createForm(): void {
    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.minLength(6), Validators.email],
      ],
      number: [''],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(2000),
        ],
      ],
    });
  }

  sendMessage(): void {
    this.contactForm.reset();
    displayMessage('success', 'message sent successfully!');
  }

  getSellerInfo(): void {
    this.auth.getUsers().subscribe((users) => {
      const seller = users.find((u) => u.name === this.advert.author);
      if (seller) {
        this.seller = seller;
      } else console.log('theres been an error');
    });
  }

  logValidationErrors(group: FormGroup = this.contactForm): void {
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
