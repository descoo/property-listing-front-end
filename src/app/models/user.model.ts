interface AdDetails {
  description: string;
  beds: string;
  baths: string;
  garages: string;
  squares: string;
}

export interface Ad {
  id: number | null;
  likedBy?: string;
  author: string;
  imgUrl: string;
  hiddenStatus: boolean;
  deleteStatus: boolean;
  featuredStatus: boolean;
  name: string;
  province: string;
  city: string;
  advertDetails: string;
  price: number;
}

export interface User {
  phone?: string;
  imgUrl?: string;
  isLocked: boolean;
  id: number | null;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface Seller {
  id: number;
  seller: string;
  email: string;
  phone: string;
}
