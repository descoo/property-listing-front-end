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
import { Search } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  provincesToSelectFrom = provinces;
  citiesToSelectFrom!: string[];
  adPrices!: number[];
  maxPrice!: number;
  minPrice!: number;
  maxPriceRanges!: number[];
  minPriceRanges!: number[];

  sub!: Subscription | undefined;
  searchCriteria!: Search;

  @Output() filter: EventEmitter<Search> = new EventEmitter<Search>();
  @Output() reset: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adService: AdvertsService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getPrices();
    this.createForm();
    this.provinceSelectionWatcher();
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
    if (
      !this.searchForm.get('search')?.value &&
      !this.searchForm.get('province')?.value &&
      !this.searchForm.get('city')?.value &&
      !this.searchForm.get('min')?.value &&
      !this.searchForm.get('max')?.value
    )
      return;

    this.searchCriteria.searchBy = this.searchForm.get('search')?.value;
    this.searchCriteria.province = this.searchForm.get('province')?.value;
    this.searchCriteria.city = this.searchForm.get('city')?.value;
    this.searchCriteria.minPrice = this.searchForm.get('min')?.value;
    this.searchCriteria.maxPrice = this.searchForm.get('max')?.value;

    if (this.searchCriteria.maxPrice === '') {
      this.searchCriteria.maxPrice = this.maxPrice.toString();
    }

    if (this.router.url !== '/homes-for-sale') {
      this.router.navigate(['/homes-for-sale']);
    }

    this.searchService.setSearchCriteria(this.searchCriteria);
    this.filter.emit(this.searchCriteria);
  }

  onReset(val: string): void {
    this.searchForm.get('search')?.patchValue('');
    this.searchForm.get('province')?.patchValue('');
    this.searchForm.get('city')?.patchValue('');
    this.searchForm.get('min')?.patchValue('');
    this.searchForm.get('max')?.patchValue('');
    if (this.router.url === '/homes-for-sale') {
      this.reset.emit(val);
    }
  }

  createForm(): void {
    this.searchService.searchCriteria$.subscribe(
      (criteria) => (this.searchCriteria = criteria)
    );
    this.searchForm = this.fb.group({
      search: [this.searchCriteria?.searchBy],
      province: [this.searchCriteria?.province],
      city: [this.searchCriteria?.city],
      min: [this.searchCriteria?.minPrice],
      max: [this.searchCriteria?.maxPrice],
    });
  }

  citiesBasedOnProvinceSelection(province: string): void {
    for (const key of cities) {
      if (key.province == province) {
        this.citiesToSelectFrom = key.cities;
      }
    }
  }

  provinceSelectionWatcher(): void {
    this.sub = this.searchForm
      .get('province')
      ?.valueChanges.subscribe((province) => {
        this.citiesBasedOnProvinceSelection(province);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
