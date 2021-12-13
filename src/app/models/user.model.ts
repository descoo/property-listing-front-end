interface AdDetail {
  description: string;
  beds: string;
  baths: string;
  garages: string;
  squares: string;
}

export interface Ad {
  imgUrl: string;
  hiddenStatus: boolean;
  name: string;
  province: string;
  city: string;
  advertDetails: string;
  price: number;
}

export interface User {
  id: number | null;
  name: string;
  surname: string;
  email: string;
  password: string;
  adverts?: Ad[];
  hiddenAdverts?: Ad[];
  deletedAdverts?: Ad[];
}
