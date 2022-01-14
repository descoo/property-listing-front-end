import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Search } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchCriteria = new BehaviorSubject<Search>({
    searchBy: '',
    province: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  searchCriteria$ = this.searchCriteria.asObservable();

  constructor() {}

  setSearchCriteria(searchCriteria: Search) {
    this.searchCriteria.next(searchCriteria);
  }
}
