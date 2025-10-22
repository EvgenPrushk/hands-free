export interface Shift {
  id: string;
  logo: string; // URL to employer logo
  address: string; // Shift address
  companyName: string; // Employer company name
  dateStartByCity: string; // Shift start date
  timeStartByCity: string; // Shift start time
  timeEndByCity: string; // Shift end time
  currentWorkers: number; // Currently hired workers (can exceed required)
  planWorkers: number; // Required number of workers
  workTypes: string; // Service type name
  priceWorker: number; // Payment amount in rubles
  customerFeedbacksCount: number; // Number of client reviews
  customerRating: number; // Client rating (max 5)
}

export interface ShiftApiResponse {
  shifts: Shift[];
  total: number;
  page: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export interface ShiftFilterParams {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: number;
  limit?: number;
}