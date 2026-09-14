import React, { useState, useEffect } from 'react';
import { SectionInfo } from '../types';
import { BrandDecor } from './BrandDecor';
import { ArrowRight, Play } from 'lucide-react';

interface PageSectionIntroProps {
  section: SectionInfo;
  onProceed: () => void;
}

export const PageSectionIntro: React.FC<PageSectionIntroProps> = ({ section, onProceed }) => {
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onProceed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onProceed]);

  return (
    <div className="relative min-h-screen bg-[#07272f] text-white flex flex-col justify-between p-6 sm:p-14 overflow-hidden select-none">
      <BrandDecor showTealCircle={true} />

      {/* Top Tag */}
      <div className="relative z-10">
        <div className="w-24 sm:w-32 h-6 sm:h-8 bg-[#10a394] rounded-sm mb-8 opacity-90" />
      </div>

      {/* Main Center Content matching PDF slide */}
      <div className="relative z-10 max-w-3xl my-auto">
        <p className="text-teal-400 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4">
          P A R T I E &nbsp; {section.part}
        </p>

        <h1 className="font-serif text-3xl sm:text-6xl font-bold tracking-tight text-white mb-6 uppercase">
          {section.title}
        </h1>

        <p className="text-xl sm:text-2xl text-teal-100/80 font-light italic">
          {section.questionCount} questions · {section.points} points
        </p>

        {/* Action button & countdown hint */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={onProceed}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-[#07272f] font-bold text-lg shadow-xl transition-all hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Démarrer la Partie {section.part}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <span className="text-xs sm:text-sm text-teal-300/70">
            Lancement automatique dans <strong className="text-amber-400 font-mono text-base">{countdown}s</strong>
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 text-xs text-teal-300/50 font-light pt-6 border-t border-teal-900/40">
        Éléments Pharma · Formation Extra MAG® · Épreuve chronométrée
      </div>
    </div>
  );
};
