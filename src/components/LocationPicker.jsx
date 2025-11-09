import React from 'react';
import { MapPin, Crosshair } from 'lucide-react';

const LocationPicker = ({ loading, locationError, onDetect, onManualChange, cityInput, setCityInput }) => {
  return (
    <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white/70 backdrop-blur rounded-xl shadow border border-emerald-100 p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="text-emerald-600" />
          <h2 className="font-semibold text-emerald-900">Pilih Lokasi</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Masukkan kota (mis. Jakarta, Bandung, Surabaya)"
              className="w-full rounded-lg border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onManualChange(cityInput)}
              disabled={!cityInput || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <MapPin size={18} /> Gunakan Kota
            </button>
            <button
              onClick={onDetect}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Crosshair size={18} />
              {loading ? 'Mencari...' : 'Deteksi Otomatis'}
            </button>
          </div>
        </div>
        {locationError && (
          <p className="text-sm text-red-600 mt-2">{locationError}</p>
        )}
      </div>
    </section>
  );
};

export default LocationPicker;
