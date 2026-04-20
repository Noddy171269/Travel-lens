import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Trash2 } from 'lucide-react';

export default function TripCard({ trip, onDelete }) {
  const start = trip.startDate
    ? new Date(trip.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '—';
  const end = trip.endDate
    ? new Date(trip.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const daysUntil = trip.startDate
    ? Math.ceil(
        (new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="card group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/trip/${trip.id}`}
            className="text-lg font-semibold text-text-primary hover:text-primary-light transition-colors block truncate"
          >
            {trip.title}
          </Link>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-text-secondary">
            <Calendar size={14} />
            <span>
              {start} — {end}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(trip.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
          title="Delete trip"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm">
          <DollarSign size={14} className="text-success" />
          <span className="text-text-secondary">Budget:</span>
          <span className="font-semibold text-text-primary">
            ₹{trip.budget?.toLocaleString() ?? '0'}
          </span>
        </div>

        {daysUntil !== null && (
          <span
            className={`badge text-xs ${
              daysUntil > 0
                ? 'bg-primary/15 text-primary-light'
                : daysUntil === 0
                ? 'bg-warning/15 text-warning'
                : 'bg-surface-lighter text-text-muted'
            }`}
          >
            {daysUntil > 0
              ? `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`
              : daysUntil === 0
              ? 'Today!'
              : 'Passed'}
          </span>
        )}
      </div>

      <Link
        to={`/trip/${trip.id}`}
        className="mt-4 block w-full text-center text-sm font-medium text-primary-light hover:text-white bg-primary/10 hover:bg-primary/20 rounded-lg py-2 transition-all"
      >
        View Details →
      </Link>
    </div>
  );
}
