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

export const api = {
  async listTravelLogs(): Promise<TravelLog[]> {
    const res = await fetch(`${BASE_URL}/travel-logs`);
    const data = await handleResponse<{ data: TravelLog[] }>(res);
    return data.data;
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
