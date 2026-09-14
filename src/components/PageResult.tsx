import React, { useEffect, useState } from 'react';
import { Participant, QuizResultSummary } from '../types';
import { QUESTIONS, SECTIONS, getStatusFromScore } from '../data/quizData';
import { generateQuizResultPdf } from '../utils/pdfExport';
import confetti from 'canvas-confetti';
import {
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface PageResultProps {
  participant: Participant;
  onRestart: () => void;
  onOpenAdmin: () => void;
}

export const PageResult: React.FC<PageResultProps> = ({ participant, onRestart, onOpenAdmin }) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(8); // Expand Q8 by default

  const totalScore = participant.totalScore;
  const maxPoints = 50;
  const percentage = Math.round((totalScore / maxPoints) * 100);
  const statusInfo = getStatusFromScore(totalScore);

  // Trigger confetti if validated
  useEffect(() => {
    if (totalScore >= 40) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10a394', '#ea943b', '#10b981', '#ffffff'],
      });
    }
  }, [totalScore]);

  // Compute breakdown by part
  const sectionBreakdown = Object.values(SECTIONS).map((sec) => {
    const sectionQuestions = QUESTIONS.filter((q) => q.part === sec.part);
    const maxPts = sec.points;
    let earnedPts = 0;
    let correctCnt = 0;

    sectionQuestions.forEach((q) => {
      const ans = participant.answers[q.id];
      if (ans?.isCorrect) {
        earnedPts += ans.pointsEarned;
        correctCnt++;
      }
    });

    return {
      part: sec.part,
      title: sec.title,
      pointsEarned: earnedPts,
      maxPoints: maxPts,
      correctCount: correctCnt,
      totalCount: sectionQuestions.length,
    };
  });

  const summary: QuizResultSummary = {
    participant,
    totalPoints: totalScore,
    maxPoints,
    percentage,
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    sectionBreakdown,
  };

  const handleExportPdf = () => {
    generateQuizResultPdf(summary);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuestions = QUESTIONS.filter((q) => {
    const isCorrect = participant.answers[q.id]?.isCorrect ?? false;
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07272f] text-slate-100 p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page 32 Header Banner */}
        <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-teal-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
              É L E M E N T S &nbsp; P H A R M A &nbsp; · &nbsp; F O R M A T I O N &nbsp; E X T R A &nbsp; M A G ®
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
              ÉPREUVE TERMINÉE
            </h1>
            <p className="text-teal-200/80 text-sm sm:text-base mb-6">
              Votre score s'affiche immédiatement. Votre évaluation a été synchronisée avec le tableau de bord formateur.
            </p>

            {/* Special Callout from Page 32 */}
            <div className="inline-flex items-center gap-3 bg-[#ea943b] text-[#2c1705] font-serif font-bold text-sm sm:text-base px-5 py-2.5 rounded-lg shadow-md mb-8">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>Correction commentée : questions 8, 15 et 23</span>
            </div>

            {/* Score & Verdict Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#051d23] rounded-xl p-6 border border-teal-800/60">
              {/* Score Display */}
              <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-teal-900/80 pb-4 md:pb-0 md:pr-6">
                <span className="text-xs text-teal-300/70 uppercase tracking-wider block mb-1">
                  Score final obtenu
                </span>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="font-serif text-5xl sm:text-6xl font-black text-white">
                    {totalScore}
                  </span>
                  <span className="text-teal-400 font-serif text-2xl font-bold">
                    / 50 pts
                  </span>
                </div>
                <div className="text-sm font-medium text-teal-200/90 mt-1">
                  Taux de réussite : <strong>{percentage}%</strong>
                </div>
              </div>

              {/* Status Badge */}
              <div className="md:col-span-5 text-center md:text-left">
                <span className="text-xs text-teal-300/70 uppercase tracking-wider block mb-1">
                  Statut de validation officiel
                </span>
                <div className="inline-block">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base sm:text-lg font-bold border ${statusInfo.badgeBg} ${statusInfo.colorClass} ${statusInfo.badgeBorder}`}
                  >
                    {statusInfo.status === 'validated' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {statusInfo.status === 'validated_with_support' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                    {statusInfo.status === 'retake' && <XCircle className="w-5 h-5 text-rose-400" />}
                    <span>{statusInfo.label}</span>
                  </span>
                </div>
                <p className="text-xs text-teal-300/60 mt-2">
                  {statusInfo.status === 'validated' && 'Félicitations ! Vous maîtrisez parfaitement les arguments scientifiques et commerciaux d\'Extra MAG®.'}
                  {statusInfo.status === 'validated_with_support' && 'Bonne maîtrise d\'ensemble. Un accompagnement ciblé sur les points clés (Q8, Q15, Q23) permettra de parfaire votre discours.'}
                  {statusInfo.status === 'retake' && 'Le seuil de 30 points n\'est pas atteint. Une session de reprise de formation est programmée.'}
                </p>
              </div>

              {/* PDF & Print Export Actions */}
              <div className="md:col-span-3 flex flex-col gap-2.5">
                <button
                  onClick={handleExportPdf}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#06242b] font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger en PDF</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-850 border border-teal-700/50 text-teal-200 text-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer le rapport</span>
                </button>
              </div>
            </div>

            {/* Candidate Metadata Strip */}
            <div className="mt-4 pt-4 border-t border-teal-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-teal-200/80">
              <div>
                <span className="text-teal-400 block font-semibold">Candidat</span>
                <span className="text-white font-medium">{participant.prenom} {participant.nom}</span>
              </div>
              <div>
                <span className="text-teal-400 block font-semibold">Secteur</span>
                <span className="text-white font-medium">{participant.secteur}</span>
              </div>
              <div>
                <span className="text-teal-400 block font-semibold">Réseau</span>
                <span className="text-white font-medium">{participant.reseau}</span>
              </div>
              <div>
                <span className="text-teal-400 block font-semibold">E-mail</span>
                <span className="text-white font-medium truncate block">{participant.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section by Section Breakdown */}
        <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-teal-800/60">
            <Layers className="w-5 h-5 text-teal-400" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Performances par domaine d'évaluation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionBreakdown.map((sec) => {
              const secPct = Math.round((sec.pointsEarned / sec.maxPoints) * 100);
              return (
                <div
                  key={sec.part}
                  className="bg-[#06242b] border border-teal-800/60 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-teal-300/80 mb-1">
                      <span className="font-bold tracking-wider uppercase text-teal-400">
                        Partie {sec.part}
                      </span>
                      <span>{sec.correctCount}/{sec.totalCount} correctes</span>
                    </div>
                    <h3 className="font-serif font-bold text-white text-base leading-snug mb-3">
                      {sec.title}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1.5 text-xs">
                      <span className="text-teal-200/80 font-medium">Points obtenus</span>
                      <span className="font-serif font-bold text-amber-400 text-sm">
                        {sec.pointsEarned} / {sec.maxPoints} pts
                      </span>
                    </div>
                    <div className="w-full h-2 bg-teal-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          secPct >= 80
                            ? 'bg-emerald-400'
                            : secPct >= 60
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review & Corrigé */}
        <div className="bg-[#0a313b] border border-teal-700/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-800/60">
            <div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Corrigé détaillé question par question (23 questions)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-teal-300/70 mt-1">
                Visualisez vos choix en face des réponses exactes et des explications scientifiques.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#051d23] p-1 rounded-xl border border-teal-800/60 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-teal-500 text-[#06242b] font-bold'
                    : 'text-teal-300 hover:text-white'
                }`}
              >
                Toutes (23)
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'correct'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-teal-300 hover:text-white'
                }`}
              >
                Correctes
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'incorrect'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-teal-300 hover:text-white'
                }`}
              >
                Erreurs
              </button>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const ans = participant.answers[q.id];
              const isCorrect = ans?.isCorrect ?? false;
              const isKeyQuestion = [8, 15, 23].includes(q.id);
              const isExpanded = expandedQuestion === q.id;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border transition-all ${
                    isCorrect
                      ? 'bg-[#06242b]/90 border-emerald-800/50'
                      : 'bg-[#082329]/90 border-rose-800/50'
                  } ${isKeyQuestion ? 'ring-1 ring-amber-400/40' : ''}`}
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-teal-900/20"
                  >
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-teal-300 uppercase">
                            Question {q.id} (Partie {q.part})
                          </span>
                          {isKeyQuestion && (
                            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              ★ Question Clé Commentée
                            </span>
                          )}
                          <span className="text-[11px] text-teal-400/70">
                            {q.points} pt{q.points > 1 ? 's' : ''}
                          </span>
                        </div>
                        <h4 className="font-serif font-semibold text-white text-sm sm:text-base line-clamp-2">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          isCorrect
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                        }`}
                      >
                        {isCorrect ? `+${q.points} pts` : '0 pt'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-teal-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-teal-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 border-t border-teal-900/60 pt-4 space-y-4">
                      {/* Options with Status */}
                      <div className="space-y-2 text-xs sm:text-sm">
                        {q.options.map((opt) => {
                          const isUserPicked = ans?.selectedOptions?.includes(opt.key);
                          const isOfficialCorrect = q.correctAnswers.includes(opt.key);

                          let stateClass = 'bg-[#041a20] border-teal-900/50 text-slate-300';
                          if (isOfficialCorrect && isUserPicked) {
                            stateClass = 'bg-emerald-950/70 border-emerald-600/70 text-emerald-200 font-medium';
                          } else if (isOfficialCorrect && !isUserPicked) {
                            stateClass = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
                          } else if (!isOfficialCorrect && isUserPicked) {
                            stateClass = 'bg-rose-950/70 border-rose-600/70 text-rose-200';
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${stateClass}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-black/40 shrink-0">
                                  {opt.key}
                                </span>
                                <span>{opt.label}</span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 text-xs">
                                {isUserPicked && (
                                  <span className="px-2 py-0.5 rounded bg-black/50 text-teal-300 font-medium">
                                    Votre choix
                                  </span>
                                )}
                                {isOfficialCorrect && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                                    ✓ Bonne réponse
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      {q.explanation && (
                        <div className="p-3.5 rounded-lg bg-[#041c22] border border-teal-700/50 text-xs sm:text-sm text-teal-100/90 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400">
                            <Sparkles className="w-4 h-4" />
                            <span>Explication pédagogique :</span>
                          </div>
                          <p className="leading-relaxed pl-5">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-teal-900/60">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-teal-300 hover:text-teal-100 text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repasser le quiz ou nouveau participant</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 border border-teal-700/50 text-teal-200 text-xs sm:text-sm transition-colors"
            >
              Consulter le Tableau de bord Formateur (Live)
            </button>
            <button
              onClick={handleExportPdf}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#06242b] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter en PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
