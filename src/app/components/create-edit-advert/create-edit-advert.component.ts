import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from 'src/app/models/user.model';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import { createEditMessages } from 'src/app/helpers/validationmsgs';
import { cities, provinces } from 'src/app/helpers/locations-data';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-advert',
  templateUrl: './create-edit-advert.component.html',
  styleUrls: ['./create-edit-advert.component.css'],
})
export class CreateEditAdvertComponent implements OnInit {
  advertForm!: FormGroup;
  errorMessage!: string;

  provincesToSelectFrom = provinces;
  citiesToSelectFrom!: string[];

  advert: Ad = {
    imgUrl: '',
    hiddenStatus: false,
    name: '',
    province: '',
    city: '',
    advertDetails: '',
    price: 0,
  };

  validationMessages: any = createEditMessages;
  formErrors: any = {
    name: '',
    province: '',
    city: '',
    advertDetails: '',
    price: '',
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public progressBarService: ProgressbarService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.formWatcher();
    this.provinceSelectionWatcher();
  }

  // get object

  // create form
  createForm(): void {
    this.advertForm = this.fb.group({
      name: [
        this.advert.name,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      province: [this.advert.province, Validators.required],
      city: [this.advert.city, Validators.required],
      advertDetails: [
        this.advert.advertDetails,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      price: [
        this.advert.price,
        [Validators.required, Validators.min(10000), Validators.max(100000000)],
      ],
    });
  }

  // user actions
  citiesBasedOnProvinceSelection(province: string): void {
    for (const key of cities) {
      if (key.province == province) {
        this.citiesToSelectFrom = key.cities;
      }
    }
  }

  provinceSelectionWatcher(): void {
    this.advertForm
      .get('province')
      ?.valueChanges.subscribe((province) =>
        this.citiesBasedOnProvinceSelection(province)
      );
  }

  formWatcher(): void {
    this.advertForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.logValidationErrors(this.advertForm);
    });
  }

  // create object from form

  // submit to backend
  submitAdvert(): void {}

  // UI functions
  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
    this.progressBarService.setShowSuccess();
    // setTimeout(() => {
    //   this.progressBarService.setShowDefaults();
    //   this.router.navigate(['/home']);
    // }, 4000);
  }

  error(message: string): void {
    this.progressBarService.setError();
    this.progressBarService.setShowError();
    this.progressBarService.completeLoading();
    // setTimeout(() => this.progressBarService.setShowDefaults(), 4000);
    // console.log(message);
  }

  logValidationErrors(group: FormGroup = this.advertForm): void {
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
