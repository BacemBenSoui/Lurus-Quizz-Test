import React from 'react';
import { Participant } from '../types';
import { Play, Timer, CheckSquare, Smartphone, Scale, ArrowLeft } from 'lucide-react';

interface PageRulesProps {
  participant: Participant;
  onProceed: () => void;
  onBack: () => void;
}

export const PageRules: React.FC<PageRulesProps> = ({ participant, onProceed, onBack }) => {
  return (
    <div className="min-h-screen bg-[#07272f] text-slate-100 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="text-teal-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
            ÉTAPE 2
          </div>
          <span className="text-xs text-teal-300/80 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800/50">
            Participant : {participant.prenom} {participant.nom} ({participant.secteur})
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mt-1">
          Règles de l'épreuve
        </h1>
      </div>

      {/* 4 Official Rule Cards */}
      <div className="max-w-4xl mx-auto w-full my-6 space-y-4">
        {/* Rule 1 */}
        <div className="relative overflow-hidden rounded-xl bg-teal-950/40 border border-teal-800/40 p-5 pl-7">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-teal-400" />
          <div className="flex items-start gap-3.5">
            <Timer className="w-6 h-6 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                Chaque question a son propre chronomètre
              </h3>
              <p className="text-teal-200/80 text-sm sm:text-base mt-1">
                À l'expiration du temps (0s), votre réponse cochée est automatiquement vérifiée et comptabilisée. Si rien n'est coché, 0 point est attribué et l'épreuve passe à la suivante.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="relative overflow-hidden rounded-xl bg-teal-950/40 border border-teal-800/40 p-5 pl-7">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-teal-500" />
          <div className="flex items-start gap-3.5">
            <CheckSquare className="w-6 h-6 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                Lisez l'énoncé : simple ou multiple
              </h3>
              <p className="text-teal-200/80 text-sm sm:text-base mt-1">
                « Cochez les TROIS » signifie trois cases, ni plus ni moins.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="relative overflow-hidden rounded-xl bg-teal-950/40 border border-teal-800/40 p-5 pl-7">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-teal-600" />
          <div className="flex items-start gap-3.5">
            <Smartphone className="w-6 h-6 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                Répondez sur votre téléphone uniquement
              </h3>
              <p className="text-teal-200/80 text-sm sm:text-base mt-1">
                Aucun document, aucune note, aucun échange.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="relative overflow-hidden rounded-xl bg-teal-950/40 border border-teal-800/40 p-5 pl-7">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-teal-700" />
          <div className="flex items-start gap-3.5">
            <Scale className="w-6 h-6 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                Les parties D et E pèsent 22 points sur 50
              </h3>
              <p className="text-teal-200/80 text-sm sm:text-base mt-1">
                Elles évaluent l'application, pas la récitation.
              </p>
            </div>
          </div>
        </div>

        {/* Official Barème Box from PDF */}
        <div className="rounded-xl bg-[#041c22] border border-teal-700/60 p-4 text-center text-xs sm:text-sm font-medium text-teal-100/90 shadow-md">
          <span className="font-bold text-teal-300">Barème officiel :</span>{' '}
          <span className="text-emerald-400 font-bold">40 pts et plus</span> = validé ·{' '}
          <span className="text-amber-400 font-bold">30 à 39</span> = validé avec accompagnement ·{' '}
          <span className="text-rose-400 font-bold">moins de 30</span> = reprise
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-4xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-300/80 hover:text-teal-100 text-sm order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modifier mes coordonnées</span>
        </button>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-[#07272f] font-bold text-lg rounded-xl shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>J'ai compris, commencer le quiz</span>
        </button>
      </div>
    </div>
  );
};
