import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css'],
})
export class SubHeaderComponent implements OnInit {
  userId!: number | null;
  constructor(private auth: AuthService) {
    this.auth.currentUser$.pipe(delay(2000)).subscribe((user) => {
      if (user) {
        this.userId = user.id;
      } else {
        this.userId = null;
      }
    });
  }

  ngOnInit(): void {}
}
