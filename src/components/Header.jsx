import React from 'react';
import { Compass, Clock } from 'lucide-react';

function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
}

const Header = ({ city, region, country, now = new Date() }) => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-b-2xl shadow">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Jadwal Shalat</h1>
          <p className="text-emerald-100 flex items-center gap-2 mt-1">
            <Compass size={18} />
            <span>{city || region || 'Lokasi tidak diketahui'}{country ? `, ${country}` : ''}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-2 text-emerald-100"><Clock size={18} /> Sekarang</p>
          <p className="text-lg font-medium">{formatDate(now)}</p>
          <p className="text-sm text-emerald-100">{now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
