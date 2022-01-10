import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { loginMessages } from 'src/app/helpers/validationmsgs';
import { Seller } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
import { SellerService } from 'src/app/services/seller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css'],
})
export class SellerProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  errorMessage!: string;
  validationMessages: any = loginMessages;
  sellerId!: number | undefined;
  seller!: Seller | undefined;
  sub!: Subscription;

  formErrors: any = {
    email: '',
    phone: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public progressBarService: ProgressbarService,
    private sellerService: SellerService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getSellerData();
    this.createForm();

    this.sub = this.profileForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.logValidationErrors(this.profileForm);
      });
  }

  getSellerData(): void {
    this.progressBarService.startLoading();
    this.sub = this.auth.getCurrentUser().subscribe((user) => {
      if (user.name) {
        this.sellerService.getSellers().subscribe((sellers) => {
          const seller = sellers.find((seller) => seller.seller === user.name);
          this.seller = seller;
          this.sellerId = seller?.id;
          if (seller) {
            this.profileForm.patchValue({
              email: seller.email,
              phone: seller.phone,
            });
            this.success();
          }
        });
      }
    });
  }

  createForm(): void {
    this.profileForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.minLength(6), Validators.email],
      ],
      phone: ['', [Validators.minLength(6), Validators.maxLength(30)]],
    });
  }

  cancelupdate(): void {
    this.router.navigate(['/adverts']);
  }
  // submit to backend
  updateProfile(): void {
    if (this.sellerId) {
      this.progressBarService.startLoading();
      const seller: Seller = { ...this.seller, ...this.profileForm.value };
      this.sub = this.sellerService.updateSeller(seller).subscribe(() => {
        this.success();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Profile updated successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/adverts']);
      });
    }
  }

  logValidationErrors(group: FormGroup = this.profileForm): void {
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

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    Swal.fire({
      position: 'top',
      icon: 'error',
      title: 'Oops something went wrong! Try again',
      showConfirmButton: false,
      timer: 1500,
    });
    this.router.navigate(['/adverts']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
