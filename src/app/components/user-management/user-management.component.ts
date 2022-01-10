import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  faLock = faLock;
  faLockOpen = faLockOpen;

  @Output() getads: EventEmitter<User> = new EventEmitter<User>();

  users!: User[];
  filteredUsers!: User[];
  selectedId!: number | null;
  ishidden: boolean = true;
  show = false;
  showActions = true;
  email!: string;
  user!: User;

  _filterBy!: string;

  get filterBy(): string {
    return this._filterBy;
  }

  set filterBy(value: string) {
    this.filterUsers(value);
  }

  constructor(
    private auth: AuthService,
    public progressBarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.setShowActions();
  }

  getCurrentUserEmail(): void {
    this.auth.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  toggleHideActions(id: number | null): void {
    this.selectedId = id;
    this.ishidden = !this.ishidden;
  }

  unlockAccount(user: User): void {
    this.auth.unlockAccount(user).subscribe(
      () => {},
      () => this.error()
    );
  }

  showInput(): void {
    this.show = !this.show;
  }

  changeUserEmail(user: User): void {
    if (this.email) {
      if (this.email.includes('@')) {
        this.progressBarService.startLoading();
        user.email = this.email;
        this.auth.editUser(user).subscribe(() => {
          displayMessage('success', 'Email updated successfully');
          this.success();
        });
      }
    }
  }

  filterUsers(filterBy: string): void {
    this.filteredUsers = this.users.filter((user) =>
      user.surname.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase())
    );
  }

  getUsers(): void {
    this.progressBarService.startLoading();
    this.auth.getUsers().subscribe((users) => {
      this.filteredUsers = users;
      this.users = users;
      this.success();
    });
  }

  setShowActions(): void {
    if (this.router.url === '/advert-management') {
      this.showActions = false;
    }
  }

  showUserAds(user: User): void {
    if (this.router.url === '/advert-management') {
      this.getads.emit(user);
    }
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong! Try again later');
  }
}
