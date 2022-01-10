import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { cities, provinces } from 'src/app/helpers/locations-data';
import { AdvertsService } from 'src/app/services/adverts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  province!: string;
  provincesToSelectFrom = provinces;
  citiesToSelectFrom!: string[];
  searchBy!: string;
  maxSearchBy!: string;
  minSearchBy!: string;
  adPrices!: number[];
  maxPrice!: number;
  minPrice!: number;
  maxPriceRanges!: number[];
  minPriceRanges!: number[];
  minmaxRanges = { min: '', max: '' };
  sub!: Subscription | undefined;

  @Output() filter: EventEmitter<string> = new EventEmitter<string>();
  @Output() minmaxfilter: EventEmitter<{ min: string; max: string }> =
    new EventEmitter<{ min: string; max: string }>();

  @Output() reset: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adService: AdvertsService
  ) {}

  ngOnInit(): void {
    this.getPrices();
    this.createForm();
    this.provinceSelectionWatcher();
    this.maxPriceSelectionWatcher();
    this.minPriceSelectionWatcher();
  }

  getPrices(): void {
    this.sub = this.adService
      .getAllAdverts()
      .pipe(map((ad) => ad.map((ad) => ad.price)))
      .subscribe((price) => {
        this.minPrice = Math.min.apply(Math, price);
        this.maxPrice = Math.max.apply(Math, price);
        let high = [2000000, 4000000, 6000000];
        let low = [6000000, 4000000, 2000000];

        if (high[0] < this.minPrice) {
          high.shift();
          high.unshift(this.minPrice);
        } else {
          high.unshift(this.minPrice);
        }

        if (high[high.length - 1] > this.maxPrice) {
          high.pop();
        }

        if (low[0] > this.maxPrice) {
          low.shift();
          low.unshift(this.maxPrice);
        }

        this.minPriceRanges = low;
        this.maxPriceRanges = high;
      });
  }

  onFilter(): void {
    if (this.searchForm.get('search')?.value !== '') {
      this.searchBy = this.searchForm.get('search')?.value;
    }

    this.searchForm.get('search')?.patchValue('');

    if (!this.searchBy && !this.minmaxRanges.min && !this.minmaxRanges.max)
      return;

    if (this.searchBy) {
      if (this.router.url !== '/homes-for-sale') {
        this.router.navigate(['/homes-for-sale']);
      }
      this.adService.searchBy = this.searchBy;
      this.filter.emit(this.searchBy);
    } else if (this.minmaxRanges) {
      if (!this.minmaxRanges.min) {
        this.minmaxRanges.min = this.minPrice.toString();
      } else if (!this.minmaxRanges.max) {
        this.minmaxRanges.max = this.maxPrice.toString();
      }
      if (this.router.url !== '/homes-for-sale') {
        this.router.navigate(['/homes-for-sale']);
      }
      this.adService.priceSearch = this.minmaxRanges;
      this.minmaxfilter.emit(this.minmaxRanges);
    }
  }

  onReset(val: string): void {
    this.searchForm.get('province')?.patchValue('');
    this.searchForm.get('city')?.patchValue('');
    this.searchForm.get('min')?.patchValue('');
    this.searchForm.get('max')?.patchValue('');
    if (this.router.url === '/homes-for-sale') {
      this.reset.emit(val);
    }
  }

  createForm(): void {
    this.searchForm = this.fb.group({
      search: [''],
      province: [''],
      city: [''],
      min: [''],
      max: [''],
    });
  }

  citiesBasedOnProvinceSelection(province: string): void {
    for (const key of cities) {
      if (key.province == province) {
        this.citiesToSelectFrom = key.cities;
      }
    }
    this.sub = this.searchForm.get('city')?.valueChanges.subscribe((city) => {
      if (city) {
        this.searchBy = city;
      }
    });
  }

  provinceSelectionWatcher(): void {
    this.sub = this.searchForm
      .get('province')
      ?.valueChanges.subscribe((province) => {
        this.province = province;
        this.searchBy = province;
        this.citiesBasedOnProvinceSelection(province);
      });
  }

  maxPriceSelectionWatcher(): void {
    this.sub = this.searchForm.get('min')?.valueChanges.subscribe((price) => {
      this.maxSearchBy = price;
      this.minmaxRanges.min = price;
    });
  }
  minPriceSelectionWatcher(): void {
    this.sub = this.searchForm.get('max')?.valueChanges.subscribe((price) => {
      this.minSearchBy = price;
      this.minmaxRanges.max = price;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
