import React from 'react';
import { Compass } from 'lucide-react';

// Simple Qibla direction display (requires bearing in degrees)
const QiblaCard = ({ bearing }) => {
  return (
    <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white/70 backdrop-blur rounded-xl shadow border border-emerald-100 p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Compass size={18} />
            <span className="font-medium">Arah Kiblat</span>
          </div>
          <p className="text-emerald-900">Perkirakan arah kiblat relatif terhadap utara magnetik.</p>
          <p className="text-2xl font-semibold text-emerald-900 mt-1">{Number.isFinite(bearing) ? `${bearing.toFixed(1)}°` : '-'}</p>
        </div>
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-200" />
          <div
            className="absolute left-1/2 top-1/2 h-10 w-1 rounded-full bg-emerald-600 origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${Number.isFinite(bearing) ? bearing : 0}deg)` }}
          />
        </div>
      </div>
    </section>
  );
};

export default QiblaCard;
