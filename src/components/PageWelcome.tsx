import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Award, Users } from 'lucide-react';
import { BrandDecor } from './BrandDecor';

interface PageWelcomeProps {
  onStart: () => void;
  onOpenAdmin: () => void;
}

export const PageWelcome: React.FC<PageWelcomeProps> = ({ onStart, onOpenAdmin }) => {
  return (
    <div className="relative min-h-screen bg-[#07272f] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
      <BrandDecor showTealCircle={true} />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs sm:text-sm tracking-[0.25em] text-teal-300/90 font-medium uppercase font-sans">
          É L E M E N T S &nbsp; P H A R M A &nbsp; | &nbsp; F O R M A T I O N &nbsp; E X T R A &nbsp; M A G ®
        </p>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-teal-900/80 hover:bg-teal-800 border border-teal-500/50 text-teal-200 hover:text-white shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Accès enseignant / formateur : résultats de tous les répondants et statistiques par section"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Interface Professeur</span>
        </button>
      </div>

      {/* Center Hero */}
      <div className="relative z-10 max-w-2xl my-auto py-10">
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
          QUIZ DE VALIDATION
        </h1>

        <p className="text-lg sm:text-2xl text-teal-100/90 font-light italic mb-8">
          23 questions · 50 points · correction automatique
        </p>

        {/* Orange Duration Box */}
        <div className="inline-block bg-[#ea943b] text-[#2c1705] font-serif font-bold text-lg sm:text-xl px-6 sm:px-8 py-3.5 rounded-lg shadow-lg mb-10">
          Durée totale : 25 minutes
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-teal-200/90 text-sm">
          <div className="flex items-center gap-2.5 bg-teal-950/40 p-3 rounded-md border border-teal-800/40">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Chronomètre par question</span>
          </div>
          <div className="flex items-center gap-2.5 bg-teal-950/40 p-3 rounded-md border border-teal-800/40">
            <Award className="w-4 h-4 text-teal-300 shrink-0" />
            <span>Score cumulatif sur 50</span>
          </div>
          <div className="flex items-center gap-2.5 bg-teal-950/40 p-3 rounded-md border border-teal-800/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rapport & PDF immédiat</span>
          </div>
        </div>

        {/* Start Button */}
        <div>
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-[#07272f] font-semibold text-lg rounded-xl shadow-xl transition-all duration-200 hover:shadow-teal-500/20 hover:scale-[1.02]"
          >
            <span>Participer au Quiz</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-teal-900/60 text-xs text-teal-300/60 font-light">
        <p>Épreuve individuelle — sans manuel ni notes</p>
        <button
          onClick={onOpenAdmin}
          className="sm:hidden flex items-center gap-1.5 text-teal-300 hover:text-teal-100 text-xs"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Accès Formateur (Suivi Live 40 participants)</span>
        </button>
      </div>
    </div>
  );
};
