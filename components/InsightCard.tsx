
import React from 'react';
import { MonthlyInsight } from '../types';
import { ICONS } from '../constants';

interface InsightCardProps {
  insight: MonthlyInsight | null;
  loading: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse">
        <div className="h-4 w-1/3 bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-2/3 bg-slate-800 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 text-indigo-400">
        <ICONS.Sparkles />
        <span className="text-xs font-bold uppercase tracking-wider">Estrategia Mensual</span>
      </div>
      <p className="text-lg font-medium text-slate-100 mb-4 italic">
        "{insight.quote}"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs text-slate-500 font-semibold mb-1 uppercase">Enfoque del Mes</h4>
          <p className="text-sm text-slate-300">{insight.focus}</p>
        </div>
        <div>
          <h4 className="text-xs text-slate-500 font-semibold mb-1 uppercase">Dato Histórico</h4>
          <p className="text-sm text-slate-400">{insight.historicalNote}</p>
        </div>
      </div>
    </div>
  );
};
