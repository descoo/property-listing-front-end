import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from '../models/user.model';

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
        adverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            hiddenStatus: false,
            name: 'Beautiful Sea view House',
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        hiddenAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            hiddenStatus: false,
            name: 'Beautiful House',
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        deletedAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            hiddenStatus: false,
            name: 'Beautiful Sea view apartment',
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
      },
      {
        id: 2,
        name: 'bill',
        surname: 'james',
        email: 'james@bill.com',
        password: 'jamesbill',
        adverts: [
          {
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
            imgUrl: '/assets/images/house.jpg',
            name: 'house3',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        hiddenAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            name: 'house',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        deletedAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            name: 'house',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
      },
      {
        id: 3,
        name: 'cathy',
        surname: 'james',
        email: 'james@cathy.com',
        password: 'jamescathy',
        adverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            name: 'house',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        hiddenAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            name: 'house',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
        deletedAdverts: [
          {
            imgUrl: '/assets/images/house.jpg',
            name: 'house',
            hiddenStatus: false,
            province: 'Western Cape',
            city: 'Cape Town',
            advertDetails:
              'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
            price: 2000000,
          },
        ],
      },
    ];
    return { users: usersInfo };
  }
}
