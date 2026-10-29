import React from 'react';
import { Check, X } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'matched' | 'missing' | 'selectable';
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  variant = 'default',
  selected = false,
  onClick,
  onRemove
}) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'matched') {
    styleClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
  } else if (variant === 'missing') {
    styleClasses = 'bg-rose-50 text-rose-800 border-rose-300 font-medium';
  } else if (variant === 'selectable') {
    styleClasses = selected
      ? 'bg-indigo-600 text-white border-indigo-600 cursor-pointer shadow-sm'
      : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer';
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${styleClasses}`}
    >
      {variant === 'matched' && <Check className="w-3 h-3 text-emerald-600" />}
      {variant === 'missing' && <X className="w-3 h-3 text-rose-500" />}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-rose-600 text-slate-400 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
