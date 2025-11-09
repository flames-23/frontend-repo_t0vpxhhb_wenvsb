import React from 'react';
import { Sunrise, Sunset, Clock } from 'lucide-react';

const labels = [
  { key: 'Fajr', label: 'Subuh', icon: Sunrise },
  { key: 'Dhuhr', label: 'Dzuhur', icon: Clock },
  { key: 'Asr', label: 'Ashar', icon: Clock },
  { key: 'Maghrib', label: 'Maghrib', icon: Sunset },
  { key: 'Isha', label: 'Isya', icon: Clock },
];

function getNextPrayer(timings) {
  if (!timings) return null;
  const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const key of order) {
    const t = timings[key];
    if (!t) continue;
    const [h, m] = t.split(':').map(Number);
    const date = new Date(today);
    date.setHours(h, m, 0, 0);
    if (date > now) {
      return { key, label: labels.find(l => l.key === key)?.label || key, time: t, at: date };
    }
  }
  // next day's Fajr
  const [h, m] = (timings['Fajr'] || '04:30').split(':').map(Number);
  const next = new Date(today);
  next.setDate(next.getDate() + 1);
  next.setHours(h, m, 0, 0);
  return { key: 'Fajr', label: 'Subuh', time: timings['Fajr'], at: next };
}

const Countdown = ({ target }) => {
  const [remaining, setRemaining] = React.useState('');
  React.useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      const hh = Math.floor(diff / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      const ss = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  return <span className="font-mono">{remaining}</span>;
};

const PrayerTimes = ({ timings }) => {
  const next = React.useMemo(() => getNextPrayer(timings), [timings]);
  return (
    <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
      {next && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-sm text-emerald-700">Waktu shalat berikutnya</p>
          <p className="text-2xl font-semibold text-emerald-900">{next.label} • {next.time} • <Countdown target={next.at} /></p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {labels.map(({ key, label, icon: Icon }) => (
          <div key={key} className="bg-white/70 backdrop-blur rounded-xl shadow border border-emerald-100 p-5 flex flex-col items-start">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </div>
            <p className="text-2xl font-semibold text-emerald-900">{timings?.[key] || '-'}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrayerTimes;
