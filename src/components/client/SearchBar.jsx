import React, { useState, useEffect } from 'react';
import { sampleRestaurants } from '../../data/restaurant';

// Haversine formula for distance calculation (unchanged)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  // Safely get unique zones
  const zones = [...new Set((sampleRestaurants || []).map((r) => r.zone))];

  // Request user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
      },
      (err) => {
        setLocationError('Unable to retrieve your location.');
        console.error(err);
      }
    );
  };

  // Filter and sort restaurants
  useEffect(() => {
    // Safeguard: if sampleRestaurants is undefined or not an array, use empty array
    const restaurants = Array.isArray(sampleRestaurants) ? sampleRestaurants : [];
    let results = [...restaurants];

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerTerm) ||
          (Array.isArray(r.dishes) && r.dishes.some((dish) => dish.toLowerCase().includes(lowerTerm)))
      );
    }

    // Filter by zone
    if (selectedZone) {
      results = results.filter((r) => r.zone === selectedZone);
    }

    // Add distance and sort if location available
    if (userLocation) {
      results = results.map((r) => ({
        ...r,
        distance: getDistance(
          userLocation.lat,
          userLocation.lng,
          r.lat,
          r.lng
        ),
      }));
      results.sort((a, b) => a.distance - b.distance);
    }

    setFilteredRestaurants(results);
  }, [searchTerm, selectedZone, userLocation]);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name or dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />

        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        >
          <option value="">All zones</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>

        <button onClick={getUserLocation} style={{ padding: '0.5rem 1rem' }}>
          Use My Location
        </button>
        {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
      </div>

      <ul>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((resto) => (
            <li key={resto.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{resto.name}</strong> – {resto.zone}
              {userLocation && resto.distance !== undefined && (
                <span> ({resto.distance.toFixed(1)} km away)</span>
              )}
              <br />
              <small>Dishes: {resto.dishes?.join(', ') || 'No dishes listed'}</small>
            </li>
          ))
        ) : (
          <li>No restaurants found.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;