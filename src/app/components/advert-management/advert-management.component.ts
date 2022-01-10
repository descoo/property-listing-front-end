import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad, User } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { FeaturedService } from 'src/app/services/featured.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advert-management',
  templateUrl: './advert-management.component.html',
  styleUrls: ['./advert-management.component.css'],
})
export class AdvertManagementComponent implements OnInit, OnDestroy {
  adverts!: Ad[];
  filteredAds!: Ad[];
  showAdverts = false;
  selectedId!: number | null;
  ishidden: boolean = true;
  sub!: Subscription;

  constructor(
    private adService: AdvertsService,
    private progressBarService: ProgressbarService,
    private featureService: FeaturedService
  ) {}

  ngOnInit(): void {
    this.getAllAds();
  }

  getUserAds(user: User): void {
    const name = user.name;
    let newAds = this.adverts.filter((ad) => ad.author === name);
    this.filteredAds = newAds;
    this.showAdverts = true;
  }

  getAllAds(): void {
    this.sub = this.adService.getAllAdverts().subscribe((ads) => {
      this.adverts = ads;
      this.filteredAds = ads;
    });
  }

  feature(ad: Ad): void {
    if ((ad.featuredStatus = true)) {
      this.sub = this.featureService.removeFromFeatured(ad).subscribe(
        () => {
          displayMessage('success', 'Advert updated successfully');
        },
        () => {
          displayMessage('error', 'Oops something went wrong!');
        }
      );
    } else {
      this.sub = this.featureService.adToFeatured(ad).subscribe(
        () => {
          displayMessage('success', 'Advert updated successfully');
        },
        () => {
          displayMessage('error', 'Oops something went wrong!');
        }
      );
    }
  }

  deleteAdvert(ad: Ad): void {
    Swal.fire({
      title: 'Are you sure you want to delete this advert?',
      text: 'This action cannot be undone, are you sure you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, Keep it!',
    }).then((confirmed: { isConfirmed: boolean }) => {
      if (confirmed.isConfirmed) {
        this.progressBarService.startLoading();
        this.selectedId = ad.id;
        this.sub = this.adService.deleteAdvert(ad).subscribe(() => {
          const newAds = this.filteredAds.filter(
            (ad) => ad.id !== this.selectedId
          );
          this.filteredAds = newAds;
          this.success();
        });
      } else {
        Swal.fire('Cancelled', 'Advert not deleted!', 'success');
      }
    });
  }

  togglehideAdvert(ad: Ad): void {
    this.sub = this.adService.toggleHide(ad).subscribe();
  }

  toggleHideActions(id: number | null): void {
    this.selectedId = id;
    this.ishidden = !this.ishidden;
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong!');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
