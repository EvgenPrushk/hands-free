import axios from 'axios';
import { ShiftApiResponse, ShiftFilterParams } from '../model/types';

const API_BASE_URL = 'https://mobile.handswork.pro/api';

class ShiftApi {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async fetchShifts(params: ShiftFilterParams): Promise<ShiftApiResponse> {
    try {
      const response = await this.api.get('/shift', {
        params: {
          lat: params.latitude,
          lng: params.longitude,
          radius: params.radius || 10, // Default 10km radius
          page: params.page || 1,
          limit: params.limit || 20,
        },
      });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.shifts)) {
        throw new Error('Invalid response format from server');
      }

      return {
        shifts: response.data.shifts.map((shift: any) => ({
          id: shift.id || String(Math.random()), // Generate ID if not provided
          logo: shift.logo || '',
          address: shift.address || 'Address not provided',
          companyName: shift.companyName || 'Company name not provided',
          dateStartByCity: shift.dateStartByCity || '',
          timeStartByCity: shift.timeStartByCity || '',
          timeEndByCity: shift.timeEndByCity || '',
          currentWorkers: Number(shift.currentWorkers) || 0,
          planWorkers: Number(shift.planWorkers) || 0,
          workTypes: shift.workTypes || 'Work type not specified',
          priceWorker: Number(shift.priceWorker) || 0,
          customerFeedbacksCount: Number(shift.customerFeedbacksCount) || 0,
          customerRating: Number(shift.customerRating) || 0,
        })),
        total: response.data.total || response.data.shifts.length,
        page: response.data.page || 1,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown server error'}`);
        } else if (error.request) {
          // Network error
          throw new Error('Network error: Unable to reach server. Please check your internet connection.');
        }
      }

      throw new Error(error instanceof Error ? error.message : 'Failed to fetch shifts');
    }
  }

  async fetchShiftById(id: string): Promise<any> {
    try {
      const response = await this.api.get(`/shift/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Shift not found');
        }
        if (error.response) {
          throw new Error(`Server error: ${error.response.status}`);
        }
        if (error.request) {
          throw new Error('Network error: Unable to reach server');
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch shift details');
    }
  }
}

export const shiftApi = new ShiftApi();