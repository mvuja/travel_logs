export type TravelLogType = 'flight' | 'rail' | 'car' | 'hotel';

export interface TravelLog {
  id: string;
  type: TravelLogType;
  departureDate: string;
  arrivalDate: string;
  comment: string | null;
  // Geocoded destination
  placeName: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  // Geocoded departure
  fromPlaceName: string | null;
  fromCity: string | null;
  fromCountry: string | null;
  fromLat: number | null;
  fromLng: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelLogFormData {
  type: TravelLogType;
  departureDate: string;
  arrivalDate: string;
  comment?: string;
  // Geocoded destination
  placeName?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  // Geocoded departure
  fromPlaceName?: string | null;
  fromCity?: string | null;
  fromCountry?: string | null;
  fromLat?: number | null;
  fromLng?: number | null;
}

export interface QueueTask {
  id: number;
  status: 'queued' | 'running' | 'success' | 'failure';
  progress: number | null;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
