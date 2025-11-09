import React from 'react';
import Header from './components/Header';
import LocationPicker from './components/LocationPicker';
import PrayerTimes from './components/PrayerTimes';
import QiblaCard from './components/QiblaCard';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

const App = () => {
  const [now, setNow] = React.useState(new Date());
  const [coords, setCoords] = React.useState(null);
  const [place, setPlace] = React.useState({ city: '', region: '', country: '' });
  const [cityInput, setCityInput] = React.useState('');
  const [loadingLoc, setLoadingLoc] = React.useState(false);
  const [locationError, setLocationError] = React.useState('');
  const [timings, setTimings] = React.useState(null);
  const [qibla, setQibla] = React.useState(NaN);

  // clock tick
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // reverse geocode helper using open APIs
  const reverseGeocode = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'id' } });
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
      const region = data.address?.state || data.address?.region || '';
      const country = data.address?.country || '';
      setPlace({ city, region, country });
      setCityInput(city);
    } catch (e) {
      // ignore
    }
  };

  const fetchByCity = async (cityName) => {
    if (!cityName) return;
    try {
      setLoadingLoc(true);
      setLocationError('');
      // Geocode city to coords using Open-Meteo geocoding
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=id&format=json`)
        .then(r => r.json());
      if (!geo.results || geo.results.length === 0) {
        throw new Error('Kota tidak ditemukan');
      }
      const { latitude, longitude, name, country, admin1 } = geo.results[0];
      setCoords({ lat: latitude, lon: longitude });
      setPlace({ city: name, region: admin1, country });
      setCityInput(name);
    } catch (e) {
      setLocationError(e.message || 'Gagal menemukan kota');
    } finally {
      setLoadingLoc(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Perangkat tidak mendukung geolokasi.');
      return;
    }
    setLoadingLoc(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });
      reverseGeocode(latitude, longitude);
      setLoadingLoc(false);
    }, (err) => {
      setLoadingLoc(false);
      setLocationError('Gagal mendeteksi lokasi. Izinkan akses lokasi pada browser.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  // fetch prayer times via public API (aladhan)
  React.useEffect(() => {
    const load = async () => {
      if (!coords && !place.city) return;
      try {
        const today = new Date();
        const d = today.getDate();
        const m = today.getMonth() + 1;
        const y = today.getFullYear();
        let url = '';
        if (coords) {
          url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${coords.lat}&longitude=${coords.lon}&method=5`;
        } else if (place.city) {
          url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(place.city)}&country=${encodeURIComponent(place.country || 'Indonesia')}&method=5`;
        }
        if (!url) return;
        const res = await fetch(url);
        const json = await res.json();
        const t = json?.data?.timings || {};
        // normalize to HH:MM 24h
        const pick = (k) => (t[k] || '').split(' ')[0];
        setTimings({
          Fajr: pick('Fajr'),
          Dhuhr: pick('Dhuhr'),
          Asr: pick('Asr'),
          Maghrib: pick('Maghrib'),
          Isha: pick('Isha'),
        });
        // Qibla
        if (coords) {
          const q = await fetch(`https://api.aladhan.com/v1/qibla/${coords.lat}/${coords.lon}`).then(r => r.json());
          const bearing = q?.data?.direction;
          setQibla(Number.isFinite(bearing) ? bearing : NaN);
        } else {
          setQibla(NaN);
        }
      } catch (e) {
        // silently ignore
      }
    };
    load();
  }, [coords, place.city, place.country]);

  React.useEffect(() => {
    // Try auto-detect once on mount
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-900">
      <Header city={place.city} region={place.region} country={place.country} now={now} />
      <main className="py-6">
        <LocationPicker
          loading={loadingLoc}
          locationError={locationError}
          onDetect={detectLocation}
          onManualChange={fetchByCity}
          cityInput={cityInput}
          setCityInput={setCityInput}
        />
        <PrayerTimes timings={timings} />
        <QiblaCard bearing={qibla} />
      </main>
      <footer className="py-10 text-center text-emerald-700">
        <p className="text-sm">Sumber data waktu shalat: Aladhan API. Geolokasi menggunakan OpenStreetMap & Open-Meteo Geocoding.</p>
      </footer>
    </div>
  );
};

export default App;
