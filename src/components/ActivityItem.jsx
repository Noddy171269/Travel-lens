import { X } from 'lucide-react';

export default function ActivityItem({ activity, onRemove }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface/50 hover:bg-surface-light/60 transition-colors group animate-fade-in">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        <span className="text-sm text-text-primary truncate">{activity}</span>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"
      >
        <X size={14} />
      </button>
    </div>
  );
}
