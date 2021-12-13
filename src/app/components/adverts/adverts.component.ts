import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css'],
})
export class AdvertsComponent implements OnInit {
  adverts!: Ad[] | undefined;
  constructor(private advertsService: AdvertsService) {}

  ngOnInit(): void {
    this.advertsService.getUser().subscribe((user) => {
      this.adverts = user.adverts;
      console.log(this.adverts);
    });
  }
}
