import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'approved':
      case 'completed':
      case 'hired':
      case 'offer_accepted':
      case 'paid':
      case 'refund_paid':
      case 'passed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'refund_eligible':
      case 'offer_extended':
      case 'shortlisted':
      case 'in_progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';

      case 'interview_scheduled':
      case 'interview_attended':
      case 'screening':
      case 'enrolled':
      case 'refund_requested':
      case 'pending':
      case 'pending_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'rejected':
      case 'failed':
      case 'suspended':
      case 'dropped':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatText = (text: string) => {
    return text
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {formatText(status)}
    </span>
  );
};
