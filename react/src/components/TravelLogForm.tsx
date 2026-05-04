import { useState } from 'react';
import { api } from '@/api';
import type { TravelLog, TravelLogFormData, TravelLogType } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { LocationSearchInput, type LocationResult } from './LocationSearchInput';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  /** Pass an existing log to enter edit mode */
  editLog?: TravelLog;
}

const TYPES: { value: TravelLogType; label: string }[] = [
  { value: 'flight', label: '✈️ Flight' },
  { value: 'rail',   label: '🚆 Rail' },
  { value: 'car',    label: '🚗 Car' },
  { value: 'hotel',  label: '🏨 Hotel' },
];

/** Convert an ISO/DB date string to the value needed by datetime-local inputs */
function toDatetimeLocal(value: string | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  // "YYYY-MM-DDTHH:mm"
  return d.toISOString().slice(0, 16);
}

function logToLocation(log: TravelLog, prefix: 'from' | 'to'): LocationResult | null {
  if (prefix === 'from') {
    if (!log.fromCountry) return null;
    return { placeName: log.fromPlaceName ?? '', city: log.fromCity ?? '', country: log.fromCountry, lat: log.fromLat ?? 0, lng: log.fromLng ?? 0 };
  }
  if (!log.country) return null;
  return { placeName: log.placeName ?? '', city: log.city ?? '', country: log.country, lat: log.latitude ?? 0, lng: log.longitude ?? 0 };
}

export function TravelLogForm({ onSuccess, onCancel, editLog }: Props) {
  const isEditing = !!editLog;

  const [type, setType] = useState<TravelLogType>(editLog?.type ?? 'flight');
  const [departureDate, setDepartureDate] = useState(toDatetimeLocal(editLog?.departureDate));
  const [arrivalDate, setArrivalDate]     = useState(toDatetimeLocal(editLog?.arrivalDate));
  const [comment, setComment]             = useState(editLog?.comment ?? '');

  // Geocoded locations
  const [fromLocation, setFromLocation] = useState<LocationResult | null>(
    editLog ? logToLocation(editLog, 'from') : null
  );
  const [toLocation, setToLocation] = useState<LocationResult | null>(
    editLog ? logToLocation(editLog, 'to') : null
  );

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isHotel     = type === 'hotel';
  const needsFromTo = !isHotel;

  const DATE_LABELS: Record<TravelLogType, { departure: string; arrival: string }> = {
    flight: { departure: 'Departure Date', arrival: 'Arrival Date' },
    rail:   { departure: 'Departure Date', arrival: 'Return Date' },
    car:    { departure: 'Departure Date', arrival: 'Return Date' },
    hotel:  { departure: 'Check-in',       arrival: 'Check-out' },
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Frontend validation — destination is always required
    const validationErrors: Record<string, string[]> = {};

    if (!departureDate) {
      validationErrors['departureDate'] = ['Departure date is required.'];
    }
    if (!arrivalDate) {
      validationErrors['arrivalDate'] = ['Arrival date is required.'];
    }
    if (!toLocation) {
      validationErrors[isHotel ? 'accommodation' : 'destination'] = ['Please select a location from the search results.'];
    }
    if (needsFromTo && !fromLocation) {
      validationErrors['departure'] = ['Please select a departure location from the search results.'];
    }
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload: TravelLogFormData = {
        type,
        departureDate,
        arrivalDate,
        comment: comment || undefined,
        // Geocoded destination
        placeName:  toLocation!.placeName,
        city:       toLocation!.city,
        country:    toLocation!.country,
        latitude:   toLocation!.lat,
        longitude:  toLocation!.lng,
        // Geocoded departure (for non-hotel types)
        fromPlaceName: fromLocation?.placeName ?? null,
        fromCity:      fromLocation?.city ?? null,
        fromCountry:   fromLocation?.country ?? null,
        fromLat:       fromLocation?.lat ?? null,
        fromLng:       fromLocation?.lng ?? null,
      };

      if (isEditing && editLog?.id) {
        await api.updateTravelLog(editLog.id, payload);
      } else {
        await api.createTravelLog(payload);
      }
      onSuccess();
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      if (e.errors) setErrors(e.errors);
      setGeneralError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Travel Log' : 'New Travel Log'}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {/* General error */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md px-3 py-2">
            {generalError}
          </div>
        )}
        {/* Type */}
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => { setType(v as TravelLogType); setFromLocation(null); setToLocation(null); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{DATE_LABELS[type].departure}<span className="text-red-500 ml-0.5">*</span></Label>
            <Input type="datetime-local" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            {errors['departureDate'] && <p className="text-xs text-red-500">{errors['departureDate'][0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{DATE_LABELS[type].arrival}<span className="text-red-500 ml-0.5">*</span></Label>
            <Input type="datetime-local" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
            {errors['arrivalDate'] && <p className="text-xs text-red-500">{errors['arrivalDate'][0]}</p>}
          </div>
        </div>

        {/* Locations */}
        {needsFromTo ? (
          <>
            <LocationSearchInput
              label="From"
              placeholder="Search departure city…"
              value={fromLocation}
              onChange={setFromLocation}
              error={errors['departure']?.[0]}
              required
            />
            <LocationSearchInput
              label="To"
              placeholder="Search destination city…"
              value={toLocation}
              onChange={setToLocation}
              error={errors['destination']?.[0]}
              required
            />
          </>
        ) : (
          <LocationSearchInput
            label="Accommodation Location"
            placeholder="Search city or hotel location…"
            value={toLocation}
            onChange={setToLocation}
            error={errors['accommodation']?.[0]}
            required
          />
        )}

        {/* Comment */}
        <div className="space-y-1.5">
          <Label>Comment <span className="text-gray-400 font-normal">(optional)</span></Label>
          <Textarea placeholder="Any notes…" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving…' : (isEditing ? 'Update' : 'Save')}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
