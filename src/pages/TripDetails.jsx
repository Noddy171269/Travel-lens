import { useEffect, useState } from 'react';
import {
  useParams,
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import {
  DollarSign,
  CalendarDays,
  FileText,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

const tabs = [
  { to: 'budget', label: 'Budget', icon: DollarSign },
  { to: 'itinerary', label: 'Itinerary', icon: CalendarDays },
  { to: 'documents', label: 'Documents', icon: FileText },
];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, fetchTrips, loading } = useTrips();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (trips.length === 0) fetchTrips();
  }, [trips, fetchTrips]);

  useEffect(() => {
    const found = trips.find((t) => t.id === id);
    setTrip(found || null);
  }, [trips, id]);

  if (loading && !trip) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  if (!trip && !loading) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Trip not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const start = trip?.startDate
    ? new Date(trip.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const end = trip?.endDate
    ? new Date(trip.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Title */}
      <div className="mb-6 animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Back to Trips
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <MapPin size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {trip?.title}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {start} — {end} &nbsp;·&nbsp; Budget ₹
              {trip?.budget?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-light/50 mb-6">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50'
              }`
            }
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Nested Route Content */}
      <Outlet context={{ trip }} />
    </div>
  );
}
