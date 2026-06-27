// App.jsx — SkyPulse Weather Application
import { useState, useCallback } from 'react';
import './index.css';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import WeatherDetails from './components/WeatherDetails';

const DEFAULT_API_KEY = '';

export default function App() {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('owm_api_key') || DEFAULT_API_KEY
  );
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'
  const [showApiKey, setShowApiKey] = useState(false);

  const {
    weather,
    forecast,
    hourly,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
  } = useWeather();

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('owm_api_key', key);
  };

  const handleSearch = useCallback(
    (city) => {
      fetchWeatherByCity(city, apiKey);
    },
    [apiKey, fetchWeatherByCity]
  );

  const handleLocationSearch = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeatherByCoords(coords.latitude, coords.longitude, apiKey);
      },
      () => {
        alert('Unable to retrieve your location. Please allow location access.');
      }
    );
  }, [apiKey, fetchWeatherByCoords]);

  return (
    <div className="app">
      <div className="main-container">
        {/* ---- Header ---- */}
        <header className="header">
          <div className="header-logo">
            <span className="header-logo-icon">🌤️</span>
            <h1>SkyPulse</h1>
          </div>
          <p>Real-time weather intelligence at your fingertips</p>
        </header>

        {/* ---- API Key Section ---- */}
        <div className="api-key-section">
          <span className="api-key-label">🔑 API Key:</span>
          <input
            id="api-key-input"
            className="api-key-input"
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter OpenWeatherMap API key..."
            value={apiKey}
            onChange={(e) => saveApiKey(e.target.value)}
            autoComplete="off"
          />
          <button
            id="toggle-api-key-btn"
            className="quick-city-btn"
            style={{ flexShrink: 0 }}
            onClick={() => setShowApiKey((v) => !v)}
          >
            {showApiKey ? '🙈' : '👁️'}
          </button>
          <a
            className="api-key-link"
            href="https://home.openweathermap.org/api_keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get free key →
          </a>
        </div>

        {/* ---- Search Bar ---- */}
        <SearchBar
          onSearch={handleSearch}
          onLocationSearch={handleLocationSearch}
          loading={loading}
        />

        {/* ---- Unit Toggle ---- */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="unit-toggle">
            <button
              id="unit-metric-btn"
              className={`unit-btn${unit === 'metric' ? ' active' : ''}`}
              onClick={() => setUnit('metric')}
            >
              °C
            </button>
            <button
              id="unit-imperial-btn"
              className={`unit-btn${unit === 'imperial' ? ' active' : ''}`}
              onClick={() => setUnit('imperial')}
            >
              °F
            </button>
          </div>
        </div>

        {/* ---- Error ---- */}
        {error && (
          <div className="error-banner" role="alert" id="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ---- Loading ---- */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {/* ---- Weather Dashboard ---- */}
        {!loading && weather && (
          <main className="weather-dashboard" id="weather-dashboard">
            <CurrentWeather weather={weather} unit={unit} />
            <WeatherDetails weather={weather} />
            {hourly && <HourlyForecast hourly={hourly} unit={unit} />}
            {forecast && <ForecastCard forecast={forecast} unit={unit} />}
          </main>
        )}

        {/* ---- Welcome / Empty State ---- */}
        {!loading && !weather && !error && (
          <section className="welcome-state" id="welcome-state">
            <span className="big-emoji">🌍</span>
            <h2>Explore the Weather Anywhere</h2>
            <p>
              Enter a city name above or click 📍 to use your location. Get
              real-time conditions, hourly and 5-day forecasts.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Powered by{' '}
              <a
                href="https://openweathermap.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >
                OpenWeatherMap API
              </a>
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
