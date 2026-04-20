import { useState, useEffect, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import TripCard from '../components/TripCard';
import {
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  X,
  Compass,
} from 'lucide-react';

export default function Dashboard() {
  const { trips, loading, fetchTrips, addTrip, removeTrip } = useTrips();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    budget: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const stats = useMemo(() => {
    const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
    const upcoming = trips.filter(
      (t) => t.startDate && new Date(t.startDate) > new Date()
    ).length;
    return { total: trips.length, totalBudget, upcoming };
  }, [trips]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await addTrip({
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget) || 0,
      });
      setForm({ title: '', startDate: '', endDate: '', budget: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create trip:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await removeTrip(tripId);
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Your Trips
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Plan, track, and organize your adventures
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Trip
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Compass size={20} className="text-primary-light" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {stats.total}
            </p>
            <p className="text-xs text-text-muted">Total Trips</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-success/15 flex items-center justify-center">
            <DollarSign size={20} className="text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              ₹{stats.totalBudget.toLocaleString()}
            </p>
            <p className="text-xs text-text-muted">Total Budget</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
            <Calendar size={20} className="text-accent-light" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {stats.upcoming}
            </p>
            <p className="text-xs text-text-muted">Upcoming</p>
          </div>
        </div>
      </div>

      {/* Trip Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            No trips yet
          </h3>
          <p className="text-sm text-text-secondary mb-5">
            Create your first trip to get started
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={18} />
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md card animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-text-primary">
                Create New Trip
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="input-field"
                  placeholder="e.g., Goa Trip"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startDate: e.target.value }))
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endDate: e.target.value }))
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Budget (₹)
                </label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budget: e.target.value }))
                  }
                  className="input-field"
                  placeholder="e.g., 25000"
                  min="0"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="btn-primary w-full justify-center mt-2"
              >
                {creating ? (
                  <div className="spinner !w-5 !h-5 !border-2" />
                ) : (
                  <>
                    <Plus size={16} />
                    Create Trip
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
