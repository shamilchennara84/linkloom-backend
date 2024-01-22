export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  mobile?: string;
  dob?: Date;
  isBlocked: boolean;
  isPremier: boolean;
  premiumExpiry?: Date;
  profilePic: string;
  wallet?: number | null;
  visibility: "public" | "private";
  location?: {
    longitude: number;
    latitude: number;
  };
  address?: {
    country: string;
    state: string;
    district: string;
    city: string;
    zip: number;
  };
  lastloggedin: number;
}
