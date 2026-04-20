import { createContext, useContext, useState, useCallback } from 'react';
import { getTrips, createTrip, deleteTrip } from '../services/tripService';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}

export function TripProvider({ children }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTrips(user.uid);
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTrip = useCallback(
    async (tripData) => {
      if (!user) return;
      const newTrip = await createTrip(user.uid, tripData);
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    },
    [user]
  );

  const removeTrip = useCallback(
    async (tripId) => {
      if (!user) return;
      await deleteTrip(user.uid, tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    },
    [user]
  );

  const value = { trips, loading, fetchTrips, addTrip, removeTrip };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}
