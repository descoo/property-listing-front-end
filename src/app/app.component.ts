import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ProgressbarService } from './services/progressbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private progressBar: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.autoLogin();
  }

  loguserOut(): void {
    this.progressBar.startLoading();

    setTimeout(() => {
      this.success();
      this.auth.logout();
      this.router.navigate(['/home']);
    }, 2000);
  }

  success(): void {
    this.progressBar.setSuccess();
    this.progressBar.completeLoading();
  }
}
