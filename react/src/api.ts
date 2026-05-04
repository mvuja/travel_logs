import type { TravelLog, TravelLogFormData, QueueTask } from './types';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message ?? 'Request failed') as Error & { errors?: Record<string, string[]> };
    err.errors = json.errors;
    throw err;
  }
  return json as T;
}

export interface TypeStats {
  flights: number;
  hotels: number;
  cars: number;
  rail: number;
}

export interface TravelLogFilters {
  sortBy?: string;
  sortDir?: string;
  type?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const api = {
  async listTravelLogs(filters: TravelLogFilters = {}): Promise<TravelLog[]> {
    const params = new URLSearchParams();
    if (filters.sortBy)   params.set('sort_by',   filters.sortBy);
    if (filters.sortDir)  params.set('sort_dir',  filters.sortDir);
    if (filters.type)     params.set('type',      filters.type);
    if (filters.country)  params.set('country',   filters.country);
    if (filters.dateFrom) params.set('date_from', filters.dateFrom);
    if (filters.dateTo)   params.set('date_to',   filters.dateTo);
    const res = await fetch(`${BASE_URL}/travel-logs?${params}`);
    const data = await handleResponse<{ data: TravelLog[] }>(res);
    return data.data;
  },

  async listCountries(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/travel-logs/countries`);
    return handleResponse<string[]>(res);
  },

  async createTravelLog(payload: TravelLogFormData): Promise<TravelLog> {
    const res = await fetch(`${BASE_URL}/travel-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<{ data: TravelLog }>(res);
    return data.data;
  },

  async updateTravelLog(id: string, payload: TravelLogFormData): Promise<TravelLog> {
    const res = await fetch(`${BASE_URL}/travel-logs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<{ data: TravelLog }>(res);
    return data.data;
  },

  async deleteTravelLog(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/travel-logs/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete travel log');
    }
  },

  async deleteAllTravelLogs(): Promise<void> {
    const res = await fetch(`${BASE_URL}/travel-logs`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete all travel logs');
    }
  },

  async bulkUpload(file: File): Promise<{ queueTaskId: number }> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/travel-logs/bulk-upload`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: form,
    });
    return handleResponse<{ queueTaskId: number }>(res);
  },

  async getQueueTask(id: number): Promise<QueueTask> {
    const res = await fetch(`${BASE_URL}/queue-tasks/${id}`);
    return handleResponse<QueueTask>(res);
  },

  async getTypeStats(): Promise<TypeStats> {
    const res = await fetch(`${BASE_URL}/stats/types`);
    return handleResponse<TypeStats>(res);
  },

  async getCountryStats(): Promise<Record<string, number>> {
    const res = await fetch(`${BASE_URL}/stats/countries`);
    return handleResponse<Record<string, number>>(res);
  },
};
