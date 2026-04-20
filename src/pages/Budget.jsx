import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useExpenses } from '../hooks/useTrips';
import ExpenseItem from '../components/ExpenseItem';
import { Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Stay', 'Shopping', 'Activities', 'Other'];

export default function Budget() {
  const { trip } = useOutletContext();
  const { expenses, loading, addExpense, removeExpense } = useExpenses(trip.id);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
  });
  const [adding, setAdding] = useState(false);

  const { totalSpent, remaining, categoryBreakdown } = useMemo(() => {
    const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const rem = (trip.budget || 0) - total;
    const cats = {};
    expenses.forEach((e) => {
      cats[e.category] = (cats[e.category] || 0) + (e.amount || 0);
    });
    return { totalSpent: total, remaining: rem, categoryBreakdown: cats };
  }, [expenses, trip.budget]);

  const percentUsed = trip.budget
    ? Math.min((totalSpent / trip.budget) * 100, 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addExpense({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      });
      setForm({ title: '', amount: '', category: 'Food', date: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wallet size={18} className="text-primary-light" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-primary">
              ₹{trip.budget?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-text-muted">Total Budget</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center">
            <TrendingDown size={18} className="text-danger-light" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-primary">
              ₹{totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-text-muted">Spent</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              remaining >= 0 ? 'bg-success/15' : 'bg-danger/15'
            }`}
          >
            <TrendingUp
              size={18}
              className={remaining >= 0 ? 'text-success' : 'text-danger'}
            />
          </div>
          <div>
            <p
              className={`text-xl font-bold ${
                remaining >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              ₹{Math.abs(remaining).toLocaleString()}
            </p>
            <p className="text-xs text-text-muted">
              {remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary">Budget Usage</span>
          <span className="text-text-primary font-semibold">
            {percentUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 90
                ? 'bg-gradient-to-r from-danger to-danger-light'
                : percentUsed > 70
                ? 'bg-gradient-to-r from-warning to-amber-400'
                : 'bg-gradient-to-r from-primary to-accent'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {/* Category tags */}
        {Object.keys(categoryBreakdown).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(categoryBreakdown).map(([cat, amt]) => (
              <span
                key={cat}
                className="badge bg-surface-lighter text-text-secondary text-xs"
              >
                {cat}: ₹{amt.toLocaleString()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expense List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Expenses ({expenses.length})
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary !py-2 !px-3 text-xs"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="p-4 mb-4 rounded-xl bg-surface/60 border border-border space-y-3 animate-fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="input-field"
                placeholder="Expense title"
                required
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                className="input-field"
                placeholder="Amount (₹)"
                min="1"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary !py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="btn-primary !py-2 text-xs"
              >
                {adding ? (
                  <div className="spinner !w-4 !h-4 !border-2" />
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner" />
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">
            No expenses yet. Add one to start tracking.
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => (
              <ExpenseItem
                key={exp.id}
                expense={exp}
                onDelete={removeExpense}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
