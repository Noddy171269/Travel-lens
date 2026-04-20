import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useItinerary } from '../hooks/useTrips';
import ActivityItem from '../components/ActivityItem';
import { Plus, CalendarDays, Trash2 } from 'lucide-react';

export default function Itinerary() {
  const { trip } = useOutletContext();
  const { days, loading, addDay, updateDay, removeDay } = useItinerary(trip.id);

  const [newActivity, setNewActivity] = useState({});
  const [adding, setAdding] = useState(false);

  const handleAddDay = async () => {
    const nextDay = days.length > 0 ? Math.max(...days.map((d) => d.day)) + 1 : 1;
    setAdding(true);
    try {
      await addDay({ day: nextDay, activities: [] });
    } catch (err) {
      console.error('Failed to add day:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleAddActivity = async (dayId, dayData) => {
    const text = newActivity[dayId]?.trim();
    if (!text) return;
    const updated = [...(dayData.activities || []), text];
    await updateDay(dayId, { activities: updated });
    setNewActivity((prev) => ({ ...prev, [dayId]: '' }));
  };

  const handleRemoveActivity = async (dayId, dayData, index) => {
    const updated = dayData.activities.filter((_, i) => i !== index);
    await updateDay(dayId, { activities: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">
          Day-by-Day Plan
        </h3>
        <button
          onClick={handleAddDay}
          disabled={adding}
          className="btn-primary !py-2 !px-3 text-xs"
        >
          {adding ? (
            <div className="spinner !w-4 !h-4 !border-2" />
          ) : (
            <>
              <Plus size={14} />
              Add Day
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : days.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarDays size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary mb-3">
            No itinerary yet. Add your first day!
          </p>
          <button onClick={handleAddDay} className="btn-primary text-sm">
            <Plus size={14} />
            Add Day 1
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} className="card animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-light">
                      {day.day}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    Day {day.day}
                  </h4>
                </div>
                <button
                  onClick={() => removeDay(day.id)}
                  className="btn-danger text-xs"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>

              {/* Activities */}
              <div className="space-y-1.5 mb-3">
                {day.activities?.length > 0 ? (
                  day.activities.map((act, i) => (
                    <ActivityItem
                      key={i}
                      activity={act}
                      onRemove={() => handleRemoveActivity(day.id, day, i)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-text-muted py-2 text-center">
                    No activities added
                  </p>
                )}
              </div>

              {/* Add activity input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newActivity[day.id] || ''}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      [day.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddActivity(day.id, day);
                    }
                  }}
                  className="input-field !py-2 text-sm"
                  placeholder="Add activity..."
                />
                <button
                  onClick={() => handleAddActivity(day.id, day)}
                  className="btn-primary !py-2 !px-3 text-xs flex-shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
