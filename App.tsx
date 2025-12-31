
import React, { useState, useMemo } from 'react';
import { CalendarDay, ViewMode } from './types';
import { DAYS_OF_WEEK, MONTHS, ICONS } from './constants';
import { Button } from './components/Button';

const HOLIDAYS_2026: Record<string, string> = {
  "2026-01-01": "Año Nuevo",
  "2026-01-12": "Reyes Magos",
  "2026-03-23": "San José",
  "2026-04-02": "Jueves Santo",
  "2026-04-03": "Viernes Santo",
  "2026-05-01": "Día del Trabajo",
  "2026-05-18": "Ascensión del Señor",
  "2026-06-08": "Corpus Christi",
  "2026-06-15": "Sagrado Corazón",
  "2026-06-29": "San Pedro y San Pablo",
  "2026-07-20": "Día de la Independencia",
  "2026-08-07": "Batalla de Boyacá",
  "2026-08-17": "Asunción de la Virgen",
  "2026-10-12": "Día de la Raza",
  "2026-11-02": "Todos los Santos",
  "2026-11-16": "Independencia de Cartagena",
  "2026-12-08": "Inmaculada Concepción",
  "2026-12-25": "Navidad"
};

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MONTH);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  const getPatternNumber = (date: Date) => {
    const start = new Date(2026, 0, 1);
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return (Math.abs(diffDays) % 2 === 0) ? 29 : 60;
  };

  const checkIsHoliday = (date: Date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return HOLIDAYS_2026[key];
  };

  const getDaysForMonth = (year: number, month: number) => {
    const firstDayJs = new Date(year, month, 1).getDay();
    const firstDayMondayStart = (firstDayJs === 0 ? 6 : firstDayJs - 1);
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = firstDayMondayStart - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isHoliday: !!checkIsHoliday(date) || date.getDay() === 0,
        holidayName: checkIsHoliday(date)
      });
    }
    
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      const holidayName = checkIsHoliday(date);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isHoliday: !!holidayName || date.getDay() === 0,
        holidayName: holidayName
      });
    }
    
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isHoliday: !!checkIsHoliday(date) || date.getDay() === 0,
        holidayName: checkIsHoliday(date)
      });
    }
    
    return days;
  };

  const daysInMonth = useMemo(() => {
    return getDaysForMonth(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const handlePrevMonth = () => {
    if (viewMode === ViewMode.MONTH) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewMode === ViewMode.MONTH) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setViewMode(ViewMode.MONTH);
  };

  const upcomingHolidays = useMemo(() => {
    return Object.entries(HOLIDAYS_2026)
      .map(([date, name]) => ({ date: new Date(date + "T00:00:00"), name }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, []);

  const renderMiniMonth = (monthIdx: number) => {
    const miniDays = getDaysForMonth(currentDate.getFullYear(), monthIdx).slice(0, 42);
    const today = new Date();
    const isThisMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === monthIdx;

    return (
      <div 
        key={monthIdx} 
        onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, 1)); setViewMode(ViewMode.MONTH); }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/50 transition-all cursor-pointer group hover:bg-slate-800/30"
      >
        <h3 className={`text-sm font-bold mb-3 ${isThisMonth ? 'text-indigo-400' : 'text-slate-200'}`}>
          {MONTHS[monthIdx]}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((d, i) => (
            <span key={i} className={`text-[10px] font-bold text-center ${d === 'Dom' ? 'text-red-500' : 'text-slate-600'}`}>
              {d.charAt(0)}
            </span>
          ))}
          {miniDays.map((day, idx) => {
            const patternNum = getPatternNumber(day.date);
            return (
              <div 
                key={idx} 
                className={`
                  text-[10px] text-center rounded-sm py-0.5 relative overflow-hidden h-6 flex flex-col items-center justify-center
                  ${day.isToday ? 'bg-indigo-600 ring-1 ring-white/30 text-white' : ''}
                  ${!day.isCurrentMonth ? 'text-transparent' : (day.isHoliday ? 'text-red-400 font-bold' : 'text-slate-400')}
                `}
              >
                <span className="relative z-10">{day.date.getDate()}</span>
                {day.isCurrentMonth && (
                  <span className="absolute inset-0 flex items-center justify-center opacity-20 text-[6px] font-black pointer-events-none text-cyan-400">
                    {patternNum}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-500 font-bold tracking-widest text-sm uppercase">
              <ICONS.Calendar />
              <span>Calendario 2026</span>
            </div>
            <div className="flex h-3 w-5 overflow-hidden rounded-[2px] shadow-sm">
              <div className="w-full h-[50%] bg-yellow-400"></div>
              <div className="w-full h-full flex flex-col">
                <div className="h-1/2 bg-blue-700"></div>
                <div className="h-1/2 bg-red-600"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {viewMode === ViewMode.MONTH ? MONTHS[currentDate.getMonth()] : 'Año Completo'} <span className="text-slate-500">{currentDate.getFullYear()}</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setViewMode(ViewMode.MONTH)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === ViewMode.MONTH ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Mes
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.YEAR)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === ViewMode.YEAR ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Año
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <Button variant="ghost" onClick={handlePrevMonth} className="h-10 w-10 !p-0">
              <ICONS.ChevronLeft />
            </Button>
            <Button variant="ghost" onClick={handleGoToToday} className="px-4 text-xs uppercase tracking-widest font-bold">
              Hoy
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsHolidayModalOpen(true)}
              className="px-4 text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-400"
            >
              Festivos
            </Button>
            <Button variant="ghost" onClick={handleNextMonth} className="h-10 w-10 !p-0">
              <ICONS.ChevronRight />
            </Button>
          </div>
        </div>
      </header>

      {/* Main View */}
      <main className="w-full flex-grow">
        {viewMode === ViewMode.MONTH ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full">
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/30">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className={`py-5 text-center text-xs font-black uppercase tracking-[0.2em] ${day === 'Dom' ? 'text-red-500' : 'text-slate-500'}`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {daysInMonth.map((day, idx) => {
                const patternNum = getPatternNumber(day.date);
                return (
                  <div
                    key={idx}
                    className={`
                      h-28 md:h-32 p-2 border-r border-b border-slate-800 transition-all duration-300 group
                      ${!day.isCurrentMonth ? 'bg-slate-950/40 opacity-40' : 'hover:bg-slate-800/40'}
                      ${idx % 7 === 6 ? 'border-r-0' : ''}
                      ${day.isToday ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/5 z-30' : ''}
                      relative flex flex-col
                    `}
                  >
                    <div className="relative z-20">
                      <span
                        className={`
                          inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full transition-all
                          ${day.isToday ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105 ring-1 ring-white/20' : ''}
                          ${!day.isToday && day.isHoliday && day.isCurrentMonth ? 'bg-red-600 text-white shadow-md shadow-red-900/20' : ''}
                          ${!day.isToday && !day.isHoliday && day.isCurrentMonth ? 'text-slate-200 group-hover:text-white' : 'text-slate-600'}
                        `}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.isToday && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      )}
                      {day.holidayName && day.isCurrentMonth && (
                        <p className="mt-1.5 text-[9px] text-red-500 font-bold uppercase leading-tight tracking-tighter max-w-full truncate opacity-90">
                          {day.holidayName}
                        </p>
                      )}
                    </div>

                    {day.isCurrentMonth && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
                        <span className="text-3xl md:text-5xl font-black text-cyan-400/20 group-hover:text-cyan-400/40 transition-all duration-500 drop-shadow-sm select-none">
                          {patternNum}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {MONTHS.map((_, idx) => renderMiniMonth(idx))}
          </div>
        )}
      </main>

      {/* Holiday Modal */}
      {isHolidayModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all"
          onClick={() => setIsHolidayModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Festivos Colombia 2026</h2>
              </div>
              <button 
                onClick={() => setIsHolidayModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-6 space-y-3 no-scrollbar">
              {upcomingHolidays.map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-red-900/30 transition-all">
                  <div className="flex flex-col items-center justify-center min-w-[50px] h-[50px] rounded-xl bg-red-600 text-white font-black">
                    <span className="text-lg leading-none">{h.date.getDate()}</span>
                    <span className="text-[10px] uppercase leading-none mt-1">{MONTHS[h.date.getMonth()].slice(0,3)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{h.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{DAYS_OF_WEEK[h.date.getDay() === 0 ? 6 : h.date.getDay()-1]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-950/20 text-center border-t border-slate-800">
              <button 
                onClick={() => setIsHolidayModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 py-8 w-full border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          Nova Intelligence Systems © 2026
        </p>
        <div className="flex gap-8">
          <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Colombia Standard Time</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
