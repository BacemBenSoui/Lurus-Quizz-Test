import React, { useState, useEffect } from 'react';
import { Participant, SectionStat, GroupStat } from '../types';
import { QUESTIONS, getStatusFromScore } from '../data/quizData';
import {
  Users,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Search,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Trash2,
  UserPlus,
  Layers,
  GraduationCap,
  Network,
  MapPin,
  Filter,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToQuiz: () => void;
  onSelectParticipant?: (p: Participant) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToQuiz, onSelectParticipant }) => {
  const [data, setData] = useState<{
    summary: {
      total: number;
      completedCount: number;
      inProgressCount: number;
      validatedCount: number;
      supportCount: number;
      retakeCount: number;
      averageScore: number;
    };
    sectionStats?: Record<'A' | 'B' | 'C' | 'D' | 'E', SectionStat>;
    networkStats?: GroupStat[];
    sectorStats?: GroupStat[];
    questionStats: Record<number, { correct: number; total: number; successRate: number }>;
    participants: Participant[];
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  const fetchLiveStats = async () => {
    try {
      const res = await fetch('/api/admin/live');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching admin live stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchLiveStats, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch('/api/admin/reset', { method: 'POST' });
      await fetchLiveStats();
      setSelectedParticipant(null);
      setSelectedNetwork('ALL');
      setSelectedSector('ALL');
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
      setShowResetConfirm(false);
    }
  };

  const handleExportCsv = () => {
    if (!data || data.participants.length === 0) return;

    const headers = [
      'Nom',
      'Prénom',
      'Secteur',
      'Réseau',
      'Email',
      'Statut',
      'Score Total / 50',
      'Pourcentage',
      'Verdict Barème',
      'Date Inscription',
      'Date Fin',
    ];

    const rows = data.participants.map((p) => {
      const pct = Math.round((p.totalScore / 50) * 100);
      const verdict = getStatusFromScore(p.totalScore).label;
      const statusStr = p.completed ? 'Terminé' : `En cours (Q${p.currentQuestionIndex})`;
      return [
        `"${p.nom}"`,
        `"${p.prenom}"`,
        `"${p.secteur}"`,
        `"${p.reseau}"`,
        `"${p.email}"`,
        `"${statusStr}"`,
        p.totalScore,
        `${pct}%`,
        `"${verdict}"`,
        `"${p.registeredAt}"`,
        `"${p.completedAt || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExtraMAG_Cohorte_Resultats_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredParticipants = (data?.participants || []).filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.nom.toLowerCase().includes(q) ||
      p.prenom.toLowerCase().includes(q) ||
      p.secteur.toLowerCase().includes(q) ||
      p.reseau.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q);

    const matchNetwork =
      selectedNetwork === 'ALL' ||
      p.reseau.trim().toLowerCase() === selectedNetwork.trim().toLowerCase();
    const matchSector =
      selectedSector === 'ALL' ||
      p.secteur.trim().toLowerCase() === selectedSector.trim().toLowerCase();

    return matchSearch && matchNetwork && matchSector;
  });

  return (
    <div className="min-h-screen bg-[#07272f] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a313b] border border-teal-700/50 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase mb-1">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>INTERFACE PROFESSEUR · FORMATION EXTRA MAG®</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live en temps réel
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Interface Professeur : Suivi & Résultats de tous les répondants
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                autoRefresh
                  ? 'bg-teal-950 text-teal-300 border-teal-600/60'
                  : 'bg-black/30 text-teal-400/60 border-teal-900/50'
              }`}
              title="Activer/Désactiver l'actualisation continue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto 3s' : 'Pause'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={!data || data.participants.length === 0}
              className="px-3.5 py-2 rounded-xl bg-teal-900/80 hover:bg-teal-800 border border-teal-700/60 text-teal-200 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs transition-colors flex items-center gap-1.5"
              title="Vider la base de données pour la session réelle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider la base</span>
            </button>

            <button
              onClick={onBackToQuiz}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#06242b] font-bold text-xs transition-all flex items-center gap-1.5 shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accès Candidat</span>
            </button>
          </div>
        </div>

        {/* Live Cohort Metrics Cards */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-[#0a313b] border border-teal-800/50 rounded-xl p-4">
              <span className="text-xs text-teal-300/70 block mb-1">Participants</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold text-white">
                  {data.summary.total}
                </span>
                <span className="text-xs text-teal-400">/ 40</span>
              </div>
              <span className="text-[11px] text-teal-300/60 mt-0.5 block">
                {data.summary.inProgressCount} en cours d'épreuve
              </span>
            </div>

            <div className="bg-[#0a313b] border border-teal-800/50 rounded-xl p-4">
              <span className="text-xs text-teal-300/70 block mb-1">Terminés</span>
              <div className="font-serif text-3xl font-bold text-teal-300">
                {data.summary.completedCount}
              </div>
              <span className="text-[11px] text-teal-300/60 mt-0.5 block">
                Soumissions reçues
              </span>
            </div>

            <div className="bg-[#0a313b] border border-teal-800/50 rounded-xl p-4">
              <span className="text-xs text-teal-300/70 block mb-1">Moyenne</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-bold text-amber-400">
                  {data.summary.averageScore}
                </span>
                <span className="text-xs text-amber-300/70">/ 50</span>
              </div>
              <span className="text-[11px] text-teal-300/60 mt-0.5 block">
                {Math.round((data.summary.averageScore / 50) * 100)}% de réussite
              </span>
            </div>

            <div className="bg-[#0a313b] border border-emerald-800/40 rounded-xl p-4">
              <span className="text-xs text-emerald-400/90 block mb-1">Validé (≥ 40)</span>
              <div className="font-serif text-3xl font-bold text-emerald-400">
                {data.summary.validatedCount}
              </div>
              <span className="text-[11px] text-emerald-300/60 mt-0.5 block">
                Objectif atteint
              </span>
            </div>

            <div className="bg-[#0a313b] border border-amber-800/40 rounded-xl p-4">
              <span className="text-xs text-amber-400/90 block mb-1">Accompagnement (30-39)</span>
              <div className="font-serif text-3xl font-bold text-amber-400">
                {data.summary.supportCount}
              </div>
              <span className="text-[11px] text-amber-300/60 mt-0.5 block">
                À renforcer
              </span>
            </div>

            <div className="bg-[#0a313b] border border-rose-800/40 rounded-xl p-4">
              <span className="text-xs text-rose-400/90 block mb-1">Reprise (&lt; 30)</span>
              <div className="font-serif text-3xl font-bold text-rose-400">
                {data.summary.retakeCount}
              </div>
              <span className="text-[11px] text-rose-300/60 mt-0.5 block">
                Session à reprogrammer
              </span>
            </div>
          </div>
        )}

        {/* Section Averages (Statistiques & Moyenne par section) */}
        {data && (
          <div className="bg-[#0a313b] border border-teal-700/60 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-800/60">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-white">
                  Statistiques Pédagogiques : Moyenne par Section
                </h2>
              </div>
              <span className="text-xs text-teal-300/70 font-light">
                Analyse comparative des 5 parties du quiz officiel Extra MAG®
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(['A', 'B', 'C', 'D', 'E'] as const).map((partKey) => {
                const s = data.sectionStats?.[partKey] || {
                  part: partKey,
                  title:
                    partKey === 'A'
                      ? 'Socle Scientifique'
                      : partKey === 'B'
                      ? 'Les 4 EXTRA'
                      : partKey === 'C'
                      ? 'Indications & Réglementaire'
                      : partKey === 'D'
                      ? 'EXTRA MAG® & STREX®'
                      : 'Mise en situation',
                  maxPoints: partKey === 'A' ? 12 : partKey === 'B' ? 10 : partKey === 'C' ? 6 : partKey === 'D' ? 10 : 12,
                  questionCount: partKey === 'A' ? 6 : partKey === 'B' ? 4 : partKey === 'C' ? 3 : partKey === 'D' ? 7 : 3,
                  averageScore: 0,
                  averagePercentage: 0,
                  respondentsCount: 0,
                };

                const pct = s.averagePercentage;
                const statusColor =
                  pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400';
                const barColor =
                  pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-400';
                const isHeavyweight = partKey === 'D' || partKey === 'E';

                return (
                  <div
                    key={partKey}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isHeavyweight
                        ? 'bg-[#06242b] border-amber-500/40 shadow-sm'
                        : 'bg-[#051d23] border-teal-900/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif font-bold text-xs text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-teal-900 text-teal-200 flex items-center justify-center font-bold text-[11px]">
                            {partKey}
                          </span>
                          <span>Partie {partKey}</span>
                        </span>
                        {isHeavyweight && (
                          <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                            Poids fort
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-semibold text-teal-200 line-clamp-1 mb-2" title={s.title}>
                        {s.title}
                      </h3>

                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xs text-teal-300/70">Moyenne :</span>
                        <div className="text-right">
                          <span className={`font-serif text-lg font-bold ${statusColor}`}>
                            {s.averageScore}
                          </span>
                          <span className="text-xs text-teal-400/70 font-sans">
                            {' '}/ {s.maxPoints} pts
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-teal-950 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-teal-300/60 pt-2 border-t border-teal-900/50">
                      <span>{s.questionCount} questions</span>
                      <span className="font-semibold text-teal-200">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics by Réseau & Secteur */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel: Analyse par Réseau */}
            <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-800/60">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-teal-400" />
                  <div>
                    <h2 className="font-serif text-base font-bold text-white">
                      Analyse par Réseau
                    </h2>
                    <p className="text-[11px] text-teal-300/70">
                      Regroupement fidèle selon les réseaux saisis par les candidats
                    </p>
                  </div>
                </div>
                {selectedNetwork !== 'ALL' && (
                  <button
                    onClick={() => setSelectedNetwork('ALL')}
                    className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Filtre : {selectedNetwork}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {(!data.networkStats || data.networkStats.length === 0) ? (
                <div className="py-8 text-center text-teal-300/60 text-xs border border-dashed border-teal-800/60 rounded-xl p-4">
                  Aucun réseau saisi pour l'instant. Les groupes s'afficheront automatiquement selon les saisies réelles des candidats.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.networkStats.map((g) => {
                    const isSelected = selectedNetwork.toLowerCase() === g.name.toLowerCase();
                    const count = g.total || g.totalParticipants || 0;
                    const completed = g.completed || g.completedCount || 0;
                    const pct = Math.round((g.averageScore / 50) * 100);
                    const color =
                      g.averageScore >= 35
                        ? 'text-emerald-400'
                        : g.averageScore >= 25
                        ? 'text-amber-400'
                        : 'text-rose-400';
                    const barBg =
                      g.averageScore >= 35
                        ? 'bg-emerald-400'
                        : g.averageScore >= 25
                        ? 'bg-amber-400'
                        : 'bg-rose-400';

                    return (
                      <div
                        key={g.name}
                        onClick={() => setSelectedNetwork(isSelected ? 'ALL' : g.name)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0c3c48] border-teal-400 ring-1 ring-teal-400/50 shadow-md'
                            : 'bg-[#07242c] border-teal-900/60 hover:bg-[#092d37] hover:border-teal-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{g.name}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800/80 text-teal-300">
                              {count} participant{count > 1 ? 's' : ''} ({completed} terminé{completed > 1 ? 's' : ''})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`font-serif text-base font-bold ${color}`}>
                              {g.averageScore}
                            </span>
                            <span className="text-xs text-teal-400/70"> / 50 pts</span>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-teal-950 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-teal-300/70 pt-1">
                          <span>Taux de validation (≥30 pts) : <strong className="text-teal-200">{g.validationRate}%</strong></span>
                          <span className="text-[10px] text-teal-400/80">
                            {isSelected ? 'Cliquer pour retirer le filtre' : 'Cliquer pour filtrer'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Panel: Analyse par Secteur */}
            <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-800/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="font-serif text-base font-bold text-white">
                      Analyse par Secteur
                    </h2>
                    <p className="text-[11px] text-teal-300/70">
                      Regroupement fidèle selon les secteurs saisis par les candidats
                    </p>
                  </div>
                </div>
                {selectedSector !== 'ALL' && (
                  <button
                    onClick={() => setSelectedSector('ALL')}
                    className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Filtre : {selectedSector}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {(!data.sectorStats || data.sectorStats.length === 0) ? (
                <div className="py-8 text-center text-teal-300/60 text-xs border border-dashed border-teal-800/60 rounded-xl p-4">
                  Aucun secteur saisi pour l'instant. Les groupes s'afficheront automatiquement selon les saisies réelles des candidats.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.sectorStats.map((g) => {
                    const isSelected = selectedSector.toLowerCase() === g.name.toLowerCase();
                    const count = g.total || g.totalParticipants || 0;
                    const completed = g.completed || g.completedCount || 0;
                    const pct = Math.round((g.averageScore / 50) * 100);
                    const color =
                      g.averageScore >= 35
                        ? 'text-emerald-400'
                        : g.averageScore >= 25
                        ? 'text-amber-400'
                        : 'text-rose-400';
                    const barBg =
                      g.averageScore >= 35
                        ? 'bg-emerald-400'
                        : g.averageScore >= 25
                        ? 'bg-amber-400'
                        : 'bg-rose-400';

                    return (
                      <div
                        key={g.name}
                        onClick={() => setSelectedSector(isSelected ? 'ALL' : g.name)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0c3c48] border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                            : 'bg-[#07242c] border-teal-900/60 hover:bg-[#092d37] hover:border-teal-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{g.name}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800/80 text-teal-300">
                              {count} participant{count > 1 ? 's' : ''} ({completed} terminé{completed > 1 ? 's' : ''})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`font-serif text-base font-bold ${color}`}>
                              {g.averageScore}
                            </span>
                            <span className="text-xs text-teal-400/70"> / 50 pts</span>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-teal-950 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-teal-300/70 pt-1">
                          <span>Taux de validation (≥30 pts) : <strong className="text-teal-200">{g.validationRate}%</strong></span>
                          <span className="text-[10px] text-amber-300/80">
                            {isSelected ? 'Cliquer pour retirer le filtre' : 'Cliquer pour filtrer'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid: Live Participants Table & Question Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table: Participants List */}
          <div className="lg:col-span-8 bg-[#0a313b] border border-teal-700/50 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h2 className="font-serif text-lg font-bold text-white">
                  Progression des participants en direct
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-900 text-teal-300">
                  {filteredParticipants.length}
                </span>
              </div>

              {/* Filters Toolbar */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Network Filter */}
                <select
                  aria-label="Filtrer par réseau"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-[#051f26] border border-teal-800/80 text-teal-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="ALL">Tous réseaux ({data?.participants.length || 0})</option>
                  {(data?.networkStats || []).map((net) => (
                    <option key={net.name} value={net.name}>
                      {net.name} ({net.total || net.totalParticipants})
                    </option>
                  ))}
                </select>

                {/* Sector Filter */}
                <select
                  aria-label="Filtrer par secteur"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-[#051f26] border border-teal-800/80 text-teal-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="ALL">Tous secteurs ({data?.participants.length || 0})</option>
                  {(data?.sectorStats || []).map((sec) => (
                    <option key={sec.name} value={sec.name}>
                      {sec.name} ({sec.total || sec.totalParticipants})
                    </option>
                  ))}
                </select>

                {/* Search Bar */}
                <div className="relative w-full sm:w-44">
                  <Search className="w-3.5 h-3.5 text-teal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Recherche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#051f26] border border-teal-800/80 text-white placeholder:text-teal-700 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                {(selectedNetwork !== 'ALL' || selectedSector !== 'ALL' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedNetwork('ALL');
                      setSelectedSector('ALL');
                      setSearchQuery('');
                    }}
                    className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-900 text-teal-300 text-xs"
                    title="Réinitialiser les filtres"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-teal-800/80 text-teal-300/80 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Candidat</th>
                    <th className="py-2.5 px-3">Secteur / Réseau</th>
                    <th className="py-2.5 px-3">Avancement</th>
                    <th className="py-2.5 px-3">Score / 50</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-2 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-900/50">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-teal-300/60">
                        {data && data.participants.length > 0
                          ? 'Aucun participant ne correspond aux filtres sélectionnés.'
                          : 'Aucun participant enregistré pour le moment. La base de données est vide et prête pour la session réelle.'}
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p, idx) => {
                      const status = getStatusFromScore(p.totalScore);
                      return (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedParticipant(p)}
                          className="hover:bg-teal-900/30 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{p.nom} {p.prenom}</span>
                            </div>
                            <span className="text-[11px] text-teal-300/60 block truncate max-w-[160px]">
                              {p.email}
                            </span>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="text-teal-200">{p.secteur}</div>
                            <div className="text-[11px] text-teal-400/60">{p.reseau}</div>
                          </td>

                          <td className="py-2.5 px-3">
                            {p.completed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>23/23 (Terminé)</span>
                              </span>
                            ) : (
                              <div>
                                <span className="text-amber-400 font-medium">
                                  Q{p.currentQuestionIndex} / 23 en cours
                                </span>
                                <div className="w-20 h-1.5 bg-teal-950 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className="h-full bg-teal-400 rounded-full"
                                    style={{ width: `${(p.currentQuestionIndex / 23) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-3 font-serif font-bold text-sm">
                            <span className={p.totalScore >= 40 ? 'text-emerald-400' : p.totalScore >= 30 ? 'text-amber-400' : 'text-rose-400'}>
                              {p.totalScore}
                            </span>
                            <span className="text-teal-400/60 text-xs"> / 50</span>
                          </td>

                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status.badgeBg} ${status.colorClass} ${status.badgeBorder}`}
                            >
                              {p.completed ? status.label : 'En cours'}
                            </span>
                          </td>

                          <td className="py-2.5 px-2 text-right text-teal-400">
                            <ChevronRight className="w-4 h-4 inline-block" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Tricky Questions & Pedagogical Analysis */}
          <div className="lg:col-span-4 space-y-6">
            {/* Question Success Rates */}
            <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-teal-800/60">
                <BarChart2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-white text-base">
                  Analyse des questions clés & difficultés
                </h3>
              </div>

              <p className="text-xs text-teal-300/70 mb-4">
                Taux de réussite pour identifier les points scientifiques à débriefer en plénière :
              </p>

              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                {[8, 15, 23, 4, 7, 12, 20, 1, 3, 21, 22].map((qId) => {
                  const q = QUESTIONS.find((item) => item.id === qId);
                  const stat = data?.questionStats?.[qId] || { correct: 0, total: 0, successRate: 0 };
                  const isKey = [8, 15, 23].includes(qId);

                  return (
                    <div
                      key={qId}
                      className={`p-2.5 rounded-lg border text-xs ${
                        isKey ? 'bg-[#06242b] border-amber-500/40' : 'bg-[#051d23] border-teal-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span>Q{qId} ({q?.partTitle})</span>
                          {isKey && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1 rounded font-bold">
                              Clé
                            </span>
                          )}
                        </span>
                        <span className="font-bold text-teal-300">
                          {stat.successRate}% ({stat.correct}/{stat.total})
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-teal-950 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${
                            stat.successRate >= 70
                              ? 'bg-emerald-400'
                              : stat.successRate >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${stat.successRate}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-teal-300/60 line-clamp-1">
                        {q?.question}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal / Drawer for Individual Participant Review */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0a313b] border border-teal-700/60 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-teal-800">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Fiche candidat : {selectedParticipant.prenom} {selectedParticipant.nom}
                  </h3>
                  <p className="text-xs text-teal-300/80">
                    {selectedParticipant.secteur} · {selectedParticipant.reseau} · {selectedParticipant.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="w-8 h-8 rounded-full bg-teal-950 text-teal-300 hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Summary Score */}
              <div className="bg-[#051d23] p-4 rounded-xl flex items-center justify-between border border-teal-800/60">
                <div>
                  <span className="text-xs text-teal-400/80 block">Score total</span>
                  <span className="font-serif text-3xl font-bold text-white">
                    {selectedParticipant.totalScore} / 50 pts
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    getStatusFromScore(selectedParticipant.totalScore).badgeBg
                  } ${getStatusFromScore(selectedParticipant.totalScore).colorClass} ${
                    getStatusFromScore(selectedParticipant.totalScore).badgeBorder
                  }`}
                >
                  {getStatusFromScore(selectedParticipant.totalScore).label}
                </span>
              </div>

              {/* Question Answers Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-teal-300 uppercase tracking-wider">
                  Détail des 23 questions répondues
                </h4>
                {QUESTIONS.map((q) => {
                  const ans = selectedParticipant.answers[q.id];
                  const isCorrect = ans?.isCorrect ?? false;
                  return (
                    <div
                      key={q.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-800/40 text-rose-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-bold">Q{q.id} : </span>
                        <span className="text-white">{q.question.substring(0, 60)}...</span>
                        <div className="text-[11px] text-teal-300/80 mt-0.5">
                          Choix : <strong>{ans?.selectedOptions && ans.selectedOptions.length > 0 ? ans.selectedOptions.join(', ') : 'Aucun choix'}</strong>
                          {ans?.timedOut && <span className="text-amber-400 font-medium ml-1.5">(Chrono 0s)</span>}
                          {' '}| Bonne rép : <strong>{q.correctAnswers.join(', ')}</strong>
                        </div>
                      </div>
                      <span className="font-bold shrink-0">{ans?.pointsEarned || 0}/{q.points} pt</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-[#06242b] font-bold text-xs rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirmation de réinitialisation de la base */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a313b] border border-rose-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Vider la base de données ?
                </h3>
              </div>
              <p className="text-teal-200/80 text-sm">
                Cette action va réinitialiser l'ensemble des données participants pour préparer la session réelle de certification. Tous les scores et réponses actuels seront effacés.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={resetting}
                  className="px-4 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 border border-teal-800/80 text-teal-300 text-xs font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{resetting ? 'Suppression...' : 'Confirmer et vider la base'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
