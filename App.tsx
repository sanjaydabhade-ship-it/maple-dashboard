
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Lead, DashboardMetrics } from './types';
import { INITIAL_LEADS } from './mockData';
import AnalysisTable from './components/AnalysisTable';
import ClientDetails from './components/ClientDetails';
import LeadAgingPanel from './components/LeadAgingPanel';
import VoiceAssistant from './components/VoiceAssistant';
import UniversalSearch from './components/UniversalSearch';
import ManagementReport from './components/ManagementReport';
import ActionBar from './components/ActionBar';
import Ticker from './components/Ticker';
import LeadHeatMap from './components/LeadHeatMap';
import LeakageDetector from './components/LeakageDetector';
import AIInsightsCard from './components/AIInsightsCard';
import Leaderboard from './components/Leaderboard';

const LEADS_SHEET_LINK = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLD5EZqAKljXZ-jrsJuFnoDc9CBjfoekSfswyoZQORcdpsH1I78e7gB9LUS8JsHkNUHJC7RStrS2wF/pub?output=csv';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const getLocalISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const cleanStr = dateStr.trim();
    const parts = cleanStr.split(/[\/\-]/);
    if (parts.length === 3) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10);
      let p2 = parseInt(parts[2], 10);
      if (p2 < 100) p2 += 2000;
      const dateDMY = new Date(p2, p1 - 1, p0); 
      const dateMDY = new Date(p2, p0 - 1, p1); 
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      if (dateDMY > now && dateMDY <= now) return dateMDY;
      if (p0 > 12 && p1 <= 12) return dateMDY;
      if (p1 <= 12 && p0 <= 31) return dateDMY;
      const d = new Date(cleanStr);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const parseCSVRows = (csv: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      if (char === '"' && csv[i + 1] === '"') { currentCell += '"'; i++; }
      else if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { currentRow.push(currentCell.trim()); currentCell = ''; }
      else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && csv[i + 1] === '\n') i++;
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c !== '')) rows.push(currentRow);
        currentRow = []; currentCell = '';
      } else { currentCell += char; }
    }
    if (currentCell || currentRow.length > 0) { currentRow.push(currentCell.trim()); rows.push(currentRow); }
    return rows;
  };

  const fetchSheetData = useCallback(async () => {
    setIsLoading(true);
    try {
      const leadsRes = await fetch(LEADS_SHEET_LINK, { cache: 'no-store' });
      const rawText = await leadsRes.text();
      const leadRows = parseCSVRows(rawText.replace(/^\uFEFF/, ''));
      if (leadRows.length > 1) {
        const headers = leadRows[0].map(h => h.toLowerCase().trim());
        const parsedLeads: Lead[] = leadRows.slice(1).map((row, index) => {
          const getVal = (aliases: string[]) => {
            const idx = headers.findIndex(h => aliases.some(a => h === a || h.includes(a)));
            return idx !== -1 ? (row[idx] || '').trim() : '';
          };
          const rawDate = getVal(['date', 'entry', 'created', 'lead date']);
          const normalizedDate = parseDateString(rawDate);
          return {
            id: parseInt(getVal(['sr no', 'id', 's.no', 'serial'])) || (index + 5000),
            date: normalizedDate ? getLocalISODate(normalizedDate) : rawDate,
            name: getVal(['name', 'prospect', 'client', 'customer']),
            mobile: getVal(['mobile', 'phone', 'contact']),
            occupation: getVal(['occupation', 'profession', 'work']),
            flatType: getVal(['flat', 'bhk', 'unit']),
            budget: getVal(['budget', 'value', 'amount']),
            source: (getVal(['source', 'channel', 'medium']) || 'Walk-in') as any,
            employeeName: getVal(['employee', 'sales', 'rep', 'executive']),
            discussion: getVal(['discussion', 'remarks', 'notes', 'feedback']),
            rating: Math.min(5, Math.max(0, parseInt(getVal(['rating', 'hot', 'priority', 'score'])) || 0)),
            siteVisitStatus: getVal(['site visit', 'visit', 'sv', 'status']),
            status: getVal(['status', 'booking', 'stage'])
          };
        });
        setLeads(parsedLeads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id));
        setLastUpdate(new Date());
      }
    } catch (err) { if (leads.length === 0) setLeads(INITIAL_LEADS); }
    finally { setIsLoading(false); }
  }, [leads]);

  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 60000);
    return () => clearInterval(interval);
  }, [fetchSheetData]);

  const calculateMetricsForRange = (start: Date, end: Date): DashboardMetrics => {
    const sStr = getLocalISODate(start);
    const eStr = getLocalISODate(end);
    const filtered = leads.filter(l => sStr === eStr ? l.date === sStr : l.date >= sStr && l.date <= eStr);
    const totalLeads = filtered.length;
    const siteVisits = filtered.filter(l => (l.siteVisitStatus || '').toLowerCase().trim() === 'done').length;
    return { 
      socialMedia: filtered.filter(l => /social|fb|insta|whatsapp|meta/i.test(l.source)).length,
      walkins: filtered.filter(l => /walk/i.test(l.source)).length,
      reference: filtered.filter(l => /ref/i.test(l.source)).length,
      broker: filtered.filter(l => /broker|partner|cp/i.test(l.source)).length,
      totalLeads, siteVisits, ratio: totalLeads > 0 ? (siteVisits / totalLeads) * 100 : 0,
      totalSoldNumber: 0, totalSoldValue: "0 Cr", totalRemainingNumber: 0, totalRemainingValue: "0 Cr", soldNumberPercent: 0, soldValuePercent: 0
    };
  };

  const metrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return {
      today: calculateMetricsForRange(today, today),
      yesterday: calculateMetricsForRange(new Date(today.getTime() - 86400000), new Date(today.getTime() - 86400000)),
      mtd: calculateMetricsForRange(startOfMonth, today),
      ytd: calculateMetricsForRange(startOfYear, today)
    };
  }, [leads]);

  const topClosingClients = useMemo(() => leads.map(l => ({...l, score: (l.rating * 20) + (l.siteVisitStatus === 'done' ? 25 : 0)})).sort((a,b) => b.score - a.score).slice(0, 10), [leads]);
  const selectedLead = useMemo(() => leads.find(l => l.id === selectedLeadId) || topClosingClients[0] || leads[0] || null, [selectedLeadId, leads, topClosingClients]);

  const leaderboard = useMemo(() => {
    const stats: Record<string, { visits: number; leads: number }> = {};
    leads.forEach(l => {
      const emp = l.employeeName || 'Unassigned';
      if (!stats[emp]) stats[emp] = { visits: 0, leads: 0 };
      stats[emp].leads++;
      if ((l.siteVisitStatus || '').toLowerCase().trim() === 'done') stats[emp].visits++;
    });
    return Object.entries(stats).sort((a, b) => b[1].visits - a[1].visits).slice(0, 4);
  }, [leads]);

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsGeneratingReport(true);
    const opt = {
      margin: 0,
      filename: `Maple_Executive_Report_${currentTime.toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    try {
      // @ts-ignore - html2pdf is globally available via script tag
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (e) {
      console.error("PDF Generation Error", e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-orange-500/30">
      <header className="bg-slate-900/60 border-b border-white/5 p-4 md:p-6 sticky top-0 z-50 backdrop-blur-3xl no-print shadow-2xl">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 hidden md:flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-100 tabular-nums tracking-wider">{currentTime.toLocaleTimeString('en-IN')}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="h-8 w-px bg-white/5 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Live Cloud Data</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Database Total: {leads.length} Leads</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center font-black shadow-lg shadow-orange-500/20 text-white">🍁</div>
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white leading-none uppercase">MAPLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">LEAD</span> DASHBOARD</h1>
            </div>
            <p className="text-[9px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] leading-none">COMMAND CENTER v2.1</p>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
            <button 
              onClick={downloadReport} 
              disabled={isGeneratingReport}
              className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <div className="w-3 h-3 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              )}
              <span>{isGeneratingReport ? 'Generating...' : 'Executive PDF'}</span>
            </button>
            <button onClick={fetchSheetData} className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95 shadow-xl animate-live-glow">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              <span>Sync Cloud</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 no-print">
        <section className="bg-slate-950/50 py-6 border-b border-white/5">
          <div className="max-w-[1920px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {[
                { label: "Today's Intake", value: metrics.today.totalLeads, color: 'orange', highlight: true },
                { label: "Site Visits", value: metrics.today.siteVisits, color: 'emerald' },
                { label: "MTD Volume", value: metrics.mtd.totalLeads, color: 'indigo' },
                { label: "Conversion Yield", value: `${metrics.mtd.ratio.toFixed(1)}%`, color: 'emerald' },
                { label: "Database Reach", value: leads.length, color: 'indigo' }
              ].map((kpi, i) => (
                <div key={i} className={`bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-inner transition-all ${kpi.highlight ? 'ring-2 ring-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : ''}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{kpi.label}</p>
                  <span className={`text-3xl md:text-5xl font-black tracking-tighter tabular-nums text-white`}>{kpi.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Modules Section */}
        <section className="max-w-[1920px] mx-auto px-4 md:px-10 py-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 h-full">
              <LeadHeatMap leads={leads} />
            </div>
            <div className="lg:col-span-4 h-full">
              <AIInsightsCard leads={leads} metrics={metrics} />
            </div>
          </div>
          <LeakageDetector leads={leads} />
        </section>

        <ActionBar leads={leads} onSelect={setSelectedLeadId} />
        <Ticker items={topClosingClients} />

        <main className="p-4 md:p-6 lg:p-10 flex flex-col gap-6 lg:gap-8 max-w-[1920px] mx-auto w-full flex-1 overflow-auto">
          {/* Main Intelligence Grid */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <aside className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:gap-8">
              <div className="bg-slate-900/60 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-xl h-[480px] flex flex-col">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Hot Closing List</h2>
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {topClosingClients.map((client) => (
                    <button key={client.id} onClick={() => setSelectedLeadId(client.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedLead?.id === client.id ? 'bg-orange-500/10 border-orange-500/40' : 'bg-white/5 border-transparent'}`}>
                      <div className="flex justify-between items-start mb-1.5"><span className="font-black text-[13px] text-slate-100">{client.name}</span><span className="text-[10px] font-black text-amber-500">★ {client.rating}</span></div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{client.discussion || 'Awaiting update...'}"</p>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 lg:gap-8">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                <div className="xl:col-span-8 flex flex-col gap-6">
                  <div className="bg-slate-900/60 rounded-3xl p-6 lg:p-10 border border-white/5 overflow-hidden shadow-2xl">
                    <AnalysisTable metrics={metrics} />
                  </div>
                </div>
                <div className="xl:col-span-4 bg-gradient-to-br from-orange-500/5 to-transparent rounded-3xl p-6 lg:p-10 border border-white/5 shadow-2xl backdrop-blur-xl">
                  {selectedLead ? <ClientDetails lead={selectedLead} /> : <div className="text-center py-20 text-slate-700 font-black uppercase text-[10px]">Select Prospect</div>}
                </div>
              </div>
              <div className="bg-slate-900/60 rounded-3xl p-6 lg:p-10 border border-white/5 shadow-2xl">
                <LeadAgingPanel leads={leads} onSelectLead={setSelectedLeadId} selectedLeadId={selectedLeadId} />
              </div>
              <div className="bg-slate-900/60 rounded-3xl p-6 lg:p-10 border border-white/5 shadow-2xl">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Executive Leaderboard</h2>
                <Leaderboard leaderboard={leaderboard} />
              </div>
            </div>
          </div>

          {/* Universal Search at the end of the Dashboard */}
          <section className="w-full">
            <UniversalSearch leads={leads} inputRef={searchInputRef} />
          </section>
        </main>
      </div>

      {/* Hidden Management Report Container for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={reportRef}>
          <ManagementReport 
            metrics={metrics} 
            leads={leads} 
            topProspects={topClosingClients} 
            leaderboard={leaderboard} 
            currentTime={currentTime} 
          />
        </div>
      </div>

      <VoiceAssistant currentTime={currentTime} metrics={metrics} leads={leads} topClosingClients={topClosingClients} selectedLead={selectedLead} leaderboard={leaderboard} />
    </div>
  );
};

export default App;
