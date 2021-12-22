import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from 'src/app/models/user.model';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import { createEditMessages } from 'src/app/helpers/validationmsgs';
import { cities, provinces } from 'src/app/helpers/locations-data';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AdvertsService } from 'src/app/services/adverts.service';

@Component({
  selector: 'app-create-edit-advert',
  templateUrl: './create-edit-advert.component.html',
  styleUrls: ['./create-edit-advert.component.css'],
})
export class CreateEditAdvertComponent implements OnInit {
  advertForm!: FormGroup;
  errorMessage!: string;
  advertId!: number;
  province!: string;
  sub!: Subscription;

  provincesToSelectFrom = provinces;
  citiesToSelectFrom!: string[];

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
    public progressBarService: ProgressbarService,
    private advertsService: AdvertsService
  ) {}

  ngOnInit(): void {
    this.routeWatcher();
    this.createForm();
    this.disableUneditableFields();
    this.formWatcher();
    this.provinceSelectionWatcher();
  }

  // get object
  routeWatcher(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) return;
      this.getAdvertData(id);
      this.advertId = id;
    });
  }
  getAdvertData(id: number): void {
    this.progressBarService.startLoading();
    this.sub = this.advertsService.getSingleAdvert(id).subscribe(
      (ad: Ad) => {
        this.advertForm.patchValue({
          id: ad.id,
          author: ad.author,
          imgUrl: ad.imgUrl,
          hiddenStatus: ad.hiddenStatus,
          name: ad.name,
          province: ad.province,
          city: ad.city,
          advertDetails: ad.advertDetails,
          price: ad.price,
        });
        this.success();
      },
      (error) => {
        this.error();
        setTimeout(() => this.router.navigate(['/adverts']), 4000);
      }
    );
  }

  // create form
  createForm(): void {
    this.advertForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      province: ['', Validators.required],
      city: ['', Validators.required],
      advertDetails: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      price: [
        '',
        [Validators.required, Validators.min(10000), Validators.max(100000000)],
      ],
    });
  }

  disableUneditableFields(): void {
    if (this.advertId) {
      this.advertForm.get('province')?.disable();
      this.advertForm.get('city')?.disable();
    }
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
    this.advertForm.get('province')?.valueChanges.subscribe((province) => {
      this.province = province;
      this.citiesBasedOnProvinceSelection(province);
    });
  }

  formWatcher(): void {
    this.advertForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.logValidationErrors(this.advertForm);
    });
  }

  // create object from form

  // submit to backend
  submitAdvert(): void {
    if (this.advertId) {
      console.log('edit', this.advertForm.value);
      return;
    }
    console.log('add', this.advertForm.value);
  }

  // UI functions
  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.setShowError();
    this.progressBarService.completeLoading();
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
