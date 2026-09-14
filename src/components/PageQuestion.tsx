import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface PageQuestionProps {
  question: Question;
  totalQuestions: number;
  cumulativeScore: number;
  onAnswerSubmit: (selectedOptions: string[], timeTaken: number, timedOut: boolean) => void;
}

export const PageQuestion: React.FC<PageQuestionProps> = ({
  question,
  totalQuestions,
  cumulativeScore,
  onAnswerSubmit,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const selectedOptionsRef = useRef<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(question.durationSeconds);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs synchronized with state
  useEffect(() => {
    selectedOptionsRef.current = selectedOptions;
  }, [selectedOptions]);

  // Reset state on question change
  useEffect(() => {
    setSelectedOptions([]);
    selectedOptionsRef.current = [];
    setTimeLeft(question.durationSeconds);
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    startTimeRef.current = Date.now();
  }, [question.id, question.durationSeconds]);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id]);

  const handleAutoTimeout = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    // Transmet la sélection actuelle (même partielle ou complète), ou [] si rien sélectionné
    onAnswerSubmit(selectedOptionsRef.current, timeTaken, true);
  };

  const handleOptionClick = (key: string) => {
    if (isSubmittingRef.current) return;

    if (question.type === 'single') {
      setSelectedOptions([key]);
      selectedOptionsRef.current = [key];
    } else {
      // Multiple selection
      if (selectedOptions.includes(key)) {
        const next = selectedOptions.filter((k) => k !== key);
        setSelectedOptions(next);
        selectedOptionsRef.current = next;
      } else {
        const maxAllowed = question.requiredCount || question.correctAnswers.length;
        let next: string[];
        if (selectedOptions.length < maxAllowed) {
          next = [...selectedOptions, key];
        } else {
          next = [...selectedOptions.slice(1), key];
        }
        setSelectedOptions(next);
        selectedOptionsRef.current = next;
      }
    }
  };

  const handleManualSubmit = () => {
    if (isSubmittingRef.current || selectedOptions.length === 0) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    onAnswerSubmit(selectedOptions, timeTaken, false);
  };

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}'${secs.toString().padStart(2, '0')}`;
    }
    return `${secs} s`;
  };

  const timerPercentage = (timeLeft / question.durationSeconds) * 100;
  const isUrgent = timeLeft <= 10;
  const requiredCount = question.requiredCount || (question.type === 'multiple' ? question.correctAnswers.length : 1);
  const isCompleteSelection = question.type === 'single' ? selectedOptions.length === 1 : selectedOptions.length === requiredCount;

  return (
    <div className="min-h-screen bg-[#07272f] text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Header Bar matching PDF Header */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          {/* Question Number & Part */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs sm:text-sm font-semibold tracking-widest text-teal-300 uppercase">
              QUESTION {question.id} / {totalQuestions} &nbsp;·&nbsp; PARTIE {question.part}
            </span>
          </div>

          {/* Badges & Timer in Top Right */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Type badge */}
            <span className="border border-teal-500/70 text-teal-300 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
              {question.typeLabel}
            </span>

            {/* Points badge */}
            <span className="font-serif font-bold text-amber-400 text-xs sm:text-base whitespace-nowrap">
              {question.points} {question.points > 1 ? 'points' : 'point'}
            </span>

            {/* Orange Timer Box matching PDF design */}
            <div
              className={`flex items-center justify-center font-serif font-bold text-base sm:text-2xl px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-md transition-colors duration-300 ${
                isUrgent
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#ea943b] text-[#2c1705]'
              }`}
            >
              <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Linear Progress and Timer Gauge */}
        <div className="relative w-full h-1.5 bg-teal-950 rounded-full overflow-hidden mb-6">
          {/* Overall Quiz Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-teal-600/40"
            style={{ width: `${(question.id / totalQuestions) * 100}%` }}
          />
          {/* Question Active Timer */}
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isUrgent ? 'bg-rose-500' : 'bg-teal-400'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Center Question Area */}
      <div className="max-w-5xl mx-auto w-full my-auto py-2">
        {/* Question text */}
        <h2 className="font-serif text-xl sm:text-3xl lg:text-3xl font-bold text-white leading-snug sm:leading-relaxed mb-3 whitespace-pre-line">
          {question.question}
        </h2>

        {/* Sub-instruction if any */}
        {question.subInstruction && (
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-lg bg-teal-950/60 border border-teal-700/40 text-teal-200 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{question.subInstruction}</span>
            {question.type === 'multiple' && (
              <span className="ml-1 text-teal-400 font-bold">
                ({selectedOptions.length}/{requiredCount} choisis)
              </span>
            )}
          </div>
        )}

        {/* Options list */}
        <div className="space-y-3 sm:space-y-3.5 mt-4">
          {question.options.map((opt) => {
            const isSelected = selectedOptions.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleOptionClick(opt.key)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start sm:items-center gap-3.5 sm:gap-4 ${
                  isSelected
                    ? 'bg-[#0f434d] border-teal-400 text-white shadow-lg ring-1 ring-teal-400/50'
                    : 'bg-[#0a313b]/80 hover:bg-[#0c3945] border-teal-800/60 text-slate-100 hover:border-teal-600/60'
                }`}
              >
                {/* Letter pill badge a, b, c, d */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-teal-400 text-[#07272f]'
                      : 'bg-[#06242b] border border-teal-700/70 text-teal-300'
                  }`}
                >
                  {opt.key}
                </div>

                {/* Option text */}
                <span className="text-sm sm:text-base leading-snug flex-1 font-normal">
                  {opt.label}
                </span>

                {/* Selection indicator mark */}
                <div
                  className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border transition-all ${
                    question.type === 'multiple' ? 'rounded-md' : 'rounded-full'
                  } ${
                    isSelected
                      ? 'bg-teal-400 border-teal-400 text-[#07272f]'
                      : 'border-teal-700/60'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-current text-[#07272f]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar with Mobile note, Score and Validation button */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-teal-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Bottom annotation from PDF */}
        <div className="flex items-center gap-4 text-xs text-teal-300/70 font-light">
          <span className="italic">Répondez sur votre téléphone</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-teal-300">
            Score cumulé actuel : <strong className="text-white font-serif">{cumulativeScore}</strong> / 50 pts
          </span>
        </div>

        {/* Submit action */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          {question.type === 'multiple' && (
            <span className="text-xs text-teal-300/80">
              {selectedOptions.length === requiredCount ? (
                <span className="text-emerald-400 font-medium">Prêt à valider</span>
              ) : (
                <span>Sélectionnez encore {requiredCount - selectedOptions.length} option(s)</span>
              )}
            </span>
          )}

          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={!isCompleteSelection || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:opacity-40 disabled:hover:bg-teal-500 text-[#07272f] font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{question.id === totalQuestions ? 'Terminer le quiz' : 'Valider la réponse'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
