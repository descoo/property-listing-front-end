import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Ad, Seller, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const usersInfo: User[] = [
      {
        id: 1,
        phone: '089 888 3424',
        isLocked: true,
        name: 'admin',
        surname: 'admin',
        email: 'user@admin.com',
        password: 'useradmin',
      },
      {
        id: 2,
        phone: '089 888 3424',
        isLocked: false,
        name: 'bill',
        surname: 'james',
        email: 'james@bill.com',
        password: 'jamesbill',
      },
      {
        id: 3,
        phone: '089 888 3424',
        isLocked: true,
        name: 'cathy',
        surname: 'james',
        email: 'james@cathy.com',
        password: 'jamescathy',
      },
    ];

    const sellersInfo: Seller[] = [
      {
        id: 1,
        seller: 'bill',
        email: 'james@bill.com',
        phone: '089 888 3424',
      },
      {
        id: 2,
        seller: 'cathy',
        email: 'admin@user.com',
        phone: '089 888 3424',
      },
      {
        id: 3,
        seller: 'bob',
        email: 'admin@user.com',
        phone: '089 888 3424',
      },
    ];

    const adverts: Ad[] = [
      {
        id: 1,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Bishopscourt Village',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 1500000,
      },
      {
        id: 2,
        author: 'cathy',
        imgUrl: '/assets/images/house.jpg',
        name: 'City center Apartment',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Kwa-Zulu Natal',
        city: 'Durban',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 5300000,
      },
      {
        id: 3,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Claremont',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: false,
        province: 'Western Cape',
        city: 'Stellenbosch',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2400000,
      },
      {
        id: 4,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Northern Park',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Kwa-Zulu Natal',
        city: 'Pietermaritzburg',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 3100000,
      },
      {
        id: 5,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Sandton apartment',
        hiddenStatus: true,
        deleteStatus: false,
        featuredStatus: false,
        province: 'Gauteng',
        city: 'Johannesburg',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2200000,
      },
    ];

    const featured: Ad[] = [
      {
        id: 1,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Bishopscourt Village',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 1500000,
      },
      {
        id: 2,
        author: 'cathy',
        imgUrl: '/assets/images/house.jpg',
        name: 'City center Apartment',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Kwa-Zulu Natal',
        city: 'Durban',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 5300000,
      },
      {
        id: 3,
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Claremont',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Western Cape',
        city: 'Stellenbosch',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 2400000,
      },
    ];

    const favourites: Ad[] = [
      {
        id: 1,
        likedBy: 'cathy',
        author: 'bill',
        imgUrl: '/assets/images/house.jpg',
        name: 'Bishopscourt Village',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Western Cape',
        city: 'Cape Town',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 1500000,
      },
      {
        id: 2,
        likedBy: 'bill',
        author: 'cathy',
        imgUrl: '/assets/images/house.jpg',
        name: 'City center Apartment',
        hiddenStatus: false,
        deleteStatus: false,
        featuredStatus: true,
        province: 'Kwa-Zulu Natal',
        city: 'Durban',
        advertDetails:
          'Beautiful 1085 sq-metres 4 beds house with 3 baths 2 garages and a pool',
        price: 5300000,
      },
    ];

    return { users: usersInfo, adverts, favourites, sellersInfo, featured };
  }
}
