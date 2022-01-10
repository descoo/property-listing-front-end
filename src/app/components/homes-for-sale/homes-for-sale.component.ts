import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-homes-for-sale',
  templateUrl: './homes-for-sale.component.html',
  styleUrls: ['./homes-for-sale.component.css'],
})
export class HomesForSaleComponent implements OnInit, OnDestroy {
  adverts!: Ad[];
  sortedAds!: Ad[];
  sortForm!: FormGroup;
  searchBy!: string;
  priceSearch!: { min: string; max: string };
  featured!: Ad[];
  tempAds!: Ad[];
  sub!: Subscription | undefined;

  constructor(
    private router: Router,
    private advertsService: AdvertsService,
    public progressBarService: ProgressbarService,
    private fb: FormBuilder
  ) {
    this.searchBy = this.advertsService.searchBy;
    this.priceSearch = this.advertsService.priceSearch;
  }

  ngOnInit(): void {
    this.getAdverts();
    this.createForm();
    this.sortWatcher();
  }

  onReset(val: string): void {
    this.sortedAds = this.adverts;
    this.advertsService.searchBy = '';
  }

  onFilter(filterBy: string): void {
    this.sortedAds = this.adverts.filter(
      (ad) =>
        ad.name.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase()) ||
        ad.province
          .toLocaleLowerCase()
          .includes(filterBy.toLocaleLowerCase()) ||
        ad.city.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase())
    );

    this.sortedAds = this.sortedAds
      .sort((a: Ad, b: Ad) => b.price - a.price)
      .sort(
        (a: Ad, b: Ad) => Number(b.featuredStatus) - Number(a.featuredStatus)
      );
  }

  onMinMaxFilter(range: { min: string; max: string }): void {
    this.sortedAds = this.adverts.filter(
      (ad) => ad.price > Number(range.min) && ad.price <= Number(range.max)
    );
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
      if (this.searchBy) {
        this.onFilter(this.searchBy);
      }
      if (this.priceSearch) {
        this.onMinMaxFilter(this.priceSearch);
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
