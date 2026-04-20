import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as tripService from '../services/tripService';

export function useExpenses(tripId) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    try {
      const data = await tripService.getExpenses(user.uid, tripId);
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [user, tripId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(
    async (expense) => {
      const newExp = await tripService.addExpense(user.uid, tripId, expense);
      setExpenses((prev) => [newExp, ...prev]);
    },
    [user, tripId]
  );

  const removeExpense = useCallback(
    async (expenseId) => {
      await tripService.deleteExpense(user.uid, tripId, expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    },
    [user, tripId]
  );

  return { expenses, loading, addExpense, removeExpense, refetch: fetchExpenses };
}

export function useItinerary(tripId) {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItinerary = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    try {
      const data = await tripService.getItinerary(user.uid, tripId);
      setDays(data);
    } catch (err) {
      console.error('Failed to fetch itinerary:', err);
    } finally {
      setLoading(false);
    }
  }, [user, tripId]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const addDay = useCallback(
    async (dayData) => {
      const newDay = await tripService.addItineraryDay(user.uid, tripId, dayData);
      setDays((prev) => [...prev, newDay].sort((a, b) => a.day - b.day));
    },
    [user, tripId]
  );

  const updateDay = useCallback(
    async (dayId, data) => {
      await tripService.updateItineraryDay(user.uid, tripId, dayId, data);
      setDays((prev) =>
        prev.map((d) => (d.id === dayId ? { ...d, ...data } : d))
      );
    },
    [user, tripId]
  );

  const removeDay = useCallback(
    async (dayId) => {
      await tripService.deleteItineraryDay(user.uid, tripId, dayId);
      setDays((prev) => prev.filter((d) => d.id !== dayId));
    },
    [user, tripId]
  );

  return { days, loading, addDay, updateDay, removeDay, refetch: fetchItinerary };
}

export function useDocuments(tripId) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user || !tripId) return;
    setLoading(true);
    try {
      const data = await tripService.getDocuments(user.uid, tripId);
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, [user, tripId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const upload = useCallback(
    async (file) => {
      const newDoc = await tripService.uploadDocument(user.uid, tripId, file);
      setDocuments((prev) => [newDoc, ...prev]);
    },
    [user, tripId]
  );

  const remove = useCallback(
    async (docId, storagePath) => {
      await tripService.deleteDocument(user.uid, tripId, docId, storagePath);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    },
    [user, tripId]
  );

  return { documents, loading, upload, remove, refetch: fetchDocuments };
}
