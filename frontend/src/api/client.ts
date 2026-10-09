import { AuthResponse, Booking, Movie, MovieDetail, Showtime, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cinepass_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return {} as T;
  }

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      const errorJson = await res.json();
      throw new Error(errorJson.message || errorJson.error || 'An unexpected error occurred');
    }
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }

  return isJson ? await res.json() : ({} as T);
}

export const api = {
  // Auth
  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<AuthResponse>(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<User>(res);
  },

  // Movies
  async getMovies(genre?: string, search?: string): Promise<Movie[]> {
    const params = new URLSearchParams();
    if (genre && genre !== 'All') params.append('genre', genre);
    if (search && search.trim()) params.append('search', search.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/movies${queryString}`);
    return handleResponse<Movie[]>(res);
  },

  async getMovieById(id: string): Promise<MovieDetail> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return handleResponse<MovieDetail>(res);
  },

  async createMovie(data: Partial<Movie>): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Movie>(res);
  },

  async updateMovie(id: string, data: Partial<Movie>): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Movie>(res);
  },

  async deleteMovie(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<void>(res);
  },

  // Showtimes
  async getShowtimesForMovie(movieId: string): Promise<Showtime[]> {
    const res = await fetch(`${API_BASE}/movies/${movieId}/showtimes`);
    return handleResponse<Showtime[]>(res);
  },

  async getAllShowtimes(): Promise<Showtime[]> {
    const res = await fetch(`${API_BASE}/showtimes`);
    return handleResponse<Showtime[]>(res);
  },

  async getShowtimeById(id: string): Promise<Showtime> {
    const res = await fetch(`${API_BASE}/showtimes/${id}`);
    return handleResponse<Showtime>(res);
  },

  async getBookedSeats(showtimeId: string): Promise<string[]> {
    const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
    return handleResponse<string[]>(res);
  },

  async createShowtime(data: {
    movieId: string;
    theatreName: string;
    showDate: string;
    showTime: string;
    ticketPrice: number;
  }): Promise<Showtime> {
    const res = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Showtime>(res);
  },

  async updateShowtime(id: string, data: {
    movieId: string;
    theatreName: string;
    showDate: string;
    showTime: string;
    ticketPrice: number;
  }): Promise<Showtime> {
    const res = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<Showtime>(res);
  },

  async deleteShowtime(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<void>(res);
  },

  // Bookings
  async createBooking(showtimeId: string, seatCodes: string[]): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ showtimeId, seatCodes })
    });
    return handleResponse<Booking>(res);
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings/mine`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Booking[]>(res);
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Booking>(res);
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Booking>(res);
  }
};
