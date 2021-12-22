import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css'],
})
export class AdvertsComponent implements OnInit {
  adverts!: Ad[] | undefined;
  author!: string;
  constructor(private router: Router, private advertsService: AdvertsService) {}

  ngOnInit(): void {
    this.advertsService.getUser().subscribe((user) => {
      this.author = user.name;
    });

    this.advertsService
      .getAdverts()
      .pipe(
        map((ad) => {
          return ad?.filter((ad) => ad.author === this.author);
          // .filter((ad) => ad.hiddenStatus === false);
        })
      )
      .subscribe((ads) => (this.adverts = ads));
  }

  hideAdvert(ad: Ad): void {
    // this.advertsService
    //   .toggleHide(ad)
    //   .subscribe((newAd: Ad) => (ad.hiddenStatus = newAd.hiddenStatus));
  }
  deleteAdvert(id: number | null): void {
    console.log('delete', id);
  }
}
