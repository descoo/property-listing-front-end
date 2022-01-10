import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() onLogout: EventEmitter<any> = new EventEmitter();
  userName!: string;
  sub!: Subscription;

  constructor(
    private progress: NgProgress,
    public progressBarService: ProgressbarService,
    private auth: AuthService
  ) {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      if (user.name) {
        this.userName = user.name;
      } else {
        this.userName = '';
      }
    });
  }

  logoutUser() {
    this.onLogout.emit();
  }

  ngOnInit(): void {
    this.progressBarService.progressRef = this.progress.ref('progressBar');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
