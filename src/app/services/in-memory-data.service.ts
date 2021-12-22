import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Ad, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const usersInfo: User[] = [
      {
        id: 1,
        name: 'admin',
        surname: 'admin',
        email: 'admin@user.com',
        password: 'useradmin',
      },
      {
        id: 2,
        name: 'bill',
        surname: 'james',
        email: 'james@bill.com',
        password: 'jamesbill',
      },
      {
        id: 3,
        name: 'cathy',
        surname: 'james',
        email: 'james@cathy.com',
        password: 'jamescathy',
      },
    ];

    const adverts: Ad[] = [
      {
        id: 1,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'house',
        hiddenStatus: false,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2000000,
      },
      {
        id: 2,
        author: 'cathy',
        imgUrl: '/assets/images/house.jpg',
        name: 'house',
        hiddenStatus: false,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2000000,
      },
      {
        id: 3,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'house2',
        hiddenStatus: false,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2000000,
      },
      {
        id: 4,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'house3',
        hiddenStatus: false,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2000000,
      },
      {
        id: 5,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'house3',
        hiddenStatus: true,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2000000,
      },
    ];

    return { users: usersInfo, adverts };
  }
}
