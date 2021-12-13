import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css'],
})
export class SubHeaderComponent implements OnInit {
  userName!: string;
  userId!: number | null;
  constructor(private auth: AuthService) {
    this.auth.setUser$.pipe(delay(4000)).subscribe((user) => {
      if (user.name) {
        this.userName = user.name;
        this.userId = user.id;
      } else {
        this.userName = '';
        this.userId = null;
      }
    });
  }

  ngOnInit(): void {}
}
