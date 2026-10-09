export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  moviePosterUrl?: string;
  theatreName: string;
  showDate: string; // YYYY-MM-DD
  showTime: string; // HH:MM:SS
  ticketPrice: number;
  createdAt?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  durationMins: number;
  rating: string;
  posterUrl: string;
  synopsis: string;
  castMembers: string;
  createdAt?: string;
}

export interface MovieDetail extends Movie {
  showtimes: Showtime[];
}

export interface Booking {
  id: string;
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  moviePosterUrl?: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  seatCodes: string[];
  seatCount: number;
  totalAmount: number;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  userName: string;
  userEmail: string;
  createdAt: string;
}

export interface ApiError {
  timestamp?: string;
  path?: string;
  error?: string;
  message: string;
}
