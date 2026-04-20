import { Trash2 } from 'lucide-react';

const categoryColors = {
  Food: 'bg-amber-500/15 text-amber-400',
  Transport: 'bg-blue-500/15 text-blue-400',
  Stay: 'bg-purple-500/15 text-purple-400',
  Shopping: 'bg-pink-500/15 text-pink-400',
  Activities: 'bg-green-500/15 text-green-400',
  Other: 'bg-gray-500/15 text-gray-400',
};

export default function ExpenseItem({ expense, onDelete }) {
  const colorClass = categoryColors[expense.category] || categoryColors.Other;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light/50 hover:bg-surface-light transition-colors group animate-fade-in">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-text-primary truncate">
            {expense.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`badge text-xs ${colorClass}`}>
              {expense.category}
            </span>
            {expense.date && (
              <span className="text-xs text-text-muted">
                {new Date(expense.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-text-primary whitespace-nowrap">
          ₹{expense.amount?.toLocaleString()}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
