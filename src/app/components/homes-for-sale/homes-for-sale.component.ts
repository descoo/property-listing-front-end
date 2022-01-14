import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  displayCustomMessage,
  displayMessage,
} from 'src/app/helpers/helperFuncs';
import { Ad, Search } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-homes-for-sale',
  templateUrl: './homes-for-sale.component.html',
  styleUrls: ['./homes-for-sale.component.css'],
})
export class HomesForSaleComponent implements OnInit, OnDestroy {
  adverts!: Ad[];
  sortedAds!: Ad[];
  sortForm!: FormGroup;
  sub!: Subscription | undefined;
  searchCriteria!: Search;

  constructor(
    private router: Router,
    private advertsService: AdvertsService,
    public progressBarService: ProgressbarService,
    private fb: FormBuilder,
    private searchService: SearchService
  ) {
    this.searchService.searchCriteria$.subscribe(
      (searchCriteria) => (this.searchCriteria = searchCriteria)
    );
  }

  ngOnInit(): void {
    this.getAdverts();
    this.createForm();
    this.sortWatcher();
  }

  onReset(val: string): void {
    this.sortedAds = this.adverts;
    this.searchCriteria.searchBy = '';
    this.searchCriteria.province = '';
    this.searchCriteria.city = '';
    this.searchCriteria.minPrice = '';
    this.searchCriteria.maxPrice = '';
    this.searchService.setSearchCriteria(this.searchCriteria);
  }

  onFilter(filterBy: Search): void {
    this.sortedAds = this.adverts;

    if (Number(filterBy.minPrice) > Number(filterBy.maxPrice)) {
      displayCustomMessage('min price cannot exceed max price');
      return;
    }

    if (filterBy.searchBy) {
      this.sortedAds = this.adverts.filter(
        (ad) =>
          ad.name
            .toLocaleLowerCase()
            .includes(filterBy.searchBy.toLocaleLowerCase()) ||
          ad.province
            .toLocaleLowerCase()
            .includes(filterBy.searchBy.toLocaleLowerCase()) ||
          ad.city
            .toLocaleLowerCase()
            .includes(filterBy.searchBy.toLocaleLowerCase())
      );
    }
    if (filterBy.province) {
      this.sortedAds = this.sortedAds.filter((ad) =>
        ad.province
          .toLocaleLowerCase()
          .includes(filterBy.province.toLocaleLowerCase())
      );
    }
    if (filterBy.city) {
      this.sortedAds = this.sortedAds.filter((ad) =>
        ad.city.toLocaleLowerCase().includes(filterBy.city.toLocaleLowerCase())
      );
    }
    if (filterBy.minPrice) {
      this.sortedAds = this.sortedAds.filter(
        (ad) => ad.price >= Number(filterBy.minPrice)
      );
    }
    if (filterBy.maxPrice) {
      this.sortedAds = this.sortedAds.filter(
        (ad) => ad.price <= Number(filterBy.maxPrice)
      );
    }

    this.sortedAds = this.sortedAds
      .sort((a: Ad, b: Ad) => b.price - a.price)
      .sort(
        (a: Ad, b: Ad) => Number(b.featuredStatus) - Number(a.featuredStatus)
      );
  }

  createForm(): void {
    this.sortForm = this.fb.group({
      sort: [''],
    });
  }

  sortWatcher(): void {
    this.sub = this.sortForm.get('sort')?.valueChanges.subscribe((val) => {
      if (val === 'descending') {
        this.sortDescending();
      } else {
        this.sortAscending();
      }
    });
  }

  getAdverts(): void {
    this.progressBarService.startLoading();
    (this.sub = this.advertsService.getAllAdverts().subscribe((ads) => {
      this.adverts = ads;
      this.sortedAds = ads;

      if (
        this.searchCriteria.searchBy ||
        this.searchCriteria.province ||
        this.searchCriteria.city ||
        this.searchCriteria.minPrice ||
        this.searchCriteria.maxPrice
      ) {
        this.onFilter(this.searchCriteria);
      }

      this.success();
    })),
      () => {
        this.error();
      };
  }

  goToAdvertDetails(id: number | null): void {
    this.router.navigate(['/homes-for-sale', id]);
  }

  sortDescending(): void {
    this.sortedAds = this.adverts.sort((a: Ad, b: Ad) => b.price - a.price);
  }
  sortAscending(): void {
    this.sortedAds = this.adverts.sort((a: Ad, b: Ad) => a.price - b.price);
  }

  // UI functions
  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong!');
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
