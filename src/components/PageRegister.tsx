import React, { useState } from 'react';
import { QrCode, Smartphone, CheckCircle, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { Participant } from '../types';

interface PageRegisterProps {
  onRegistered: (participant: Participant) => void;
  onBack: () => void;
}

export const PageRegister: React.FC<PageRegisterProps> = ({ onRegistered, onBack }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [secteur, setSecteur] = useState('');
  const [reseau, setReseau] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nom.trim() || !prenom.trim() || !secteur.trim() || !reseau.trim() || !email.trim()) {
      setError('Tous les champs ci-dessous sont strictement obligatoires pour valider votre inscription.');
      return;
    }

    // Basic email check
    if (!email.includes('@') || !email.includes('.')) {
      setError('Veuillez renseigner une adresse e-mail valide.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          prenom: prenom.trim(),
          secteur: secteur.trim(),
          reseau: reseau.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      const data = await res.json();
      onRegistered(data.participant);
    } catch (err: any) {
      console.warn('Backend register error, fallback to local participant session:', err);
      // Fallback local participant in case offline
      const fallbackParticipant: Participant = {
        id: 'cand_' + Math.random().toString(36).substring(2, 9),
        nom: nom.trim(),
        prenom: prenom.trim(),
        secteur: secteur.trim(),
        reseau: reseau.trim(),
        email: email.trim().toLowerCase(),
        registeredAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        currentQuestionIndex: 0,
        completed: false,
        totalScore: 0,
        answers: {},
      };
      onRegistered(fallbackParticipant);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07272f] text-slate-100 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="text-teal-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
          ÉTAPE 1
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Scannez pour accéder au questionnaire
        </h1>
      </div>

      {/* Main Grid: Steps on Left, Interactive Form / QR on Right */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
        {/* Left Column: 4 Official Steps from Document */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-950/40 border border-teal-800/40">
            <div className="w-10 h-10 rounded-full bg-[#051d23] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-teal-700/50">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Sortez votre téléphone</h3>
              <p className="text-teal-200/70 text-xs sm:text-sm mt-0.5">
                Appareil photo ou lecteur de QR — rien à installer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-950/40 border border-teal-800/40">
            <div className="w-10 h-10 rounded-full bg-[#051d23] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-teal-700/50">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Scannez le code ou remplissez ci-contre</h3>
              <p className="text-teal-200/70 text-xs sm:text-sm mt-0.5">
                Le formulaire s'ouvre directement dans votre navigateur mobile.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-950/40 border border-teal-800/40">
            <div className="w-10 h-10 rounded-full bg-[#051d23] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-teal-700/50">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Saisissez nom, secteur et réseau</h3>
              <p className="text-teal-200/70 text-xs sm:text-sm mt-0.5">
                Champs obligatoires avec votre e-mail pour le suivi individuel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-950/40 border border-teal-800/40">
            <div className="w-10 h-10 rounded-full bg-[#051d23] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-teal-700/50">
              4
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Attendez le signal</h3>
              <p className="text-teal-200/70 text-xs sm:text-sm mt-0.5">
                Ne répondez pas avant l'affichage officiel de chaque question.
              </p>
            </div>
          </div>

          {/* Quick Demo Pre-Fill buttons for testing */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs text-teal-300/80">
            <span>Pré-remplir pour test :</span>
            <button
              type="button"
              onClick={() => {
                setNom('Ben Salem');
                setPrenom('Yosra');
                setSecteur('Tunis Nord');
                setReseau('Réseau Officine');
                setEmail('yosra.bensalem@pharmasud.tn');
              }}
              className="underline hover:text-teal-100"
            >
              Délégué 1
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setNom('Trabelsi');
                setPrenom('Amine');
                setSecteur('Sousse');
                setReseau('Réseau Médical');
                setEmail('amine.trabelsi@elements-pharma.tn');
              }}
              className="underline hover:text-teal-100"
            >
              Délégué 2
            </button>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="lg:col-span-6 bg-[#0a313b] border border-teal-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-teal-800/50">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-teal-400" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                Fiche d'identification du participant
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-900/80 text-teal-300 rounded border border-teal-700/60">
              40 places
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-200 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-teal-200/90 mb-1">
                  Nom <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ben Salem"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#051f26] border border-teal-700/60 text-white placeholder:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-200/90 mb-1">
                  Prénom <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Yosra"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#051f26] border border-teal-700/60 text-white placeholder:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-teal-200/90 mb-1">
                  Secteur <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grand Tunis, Sfax, Sousse..."
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#051f26] border border-teal-700/60 text-white placeholder:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-200/90 mb-1">
                  Réseau <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réseau Officine, Réseau Médical..."
                  value={reseau}
                  onChange={(e) => setReseau(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#051f26] border border-teal-700/60 text-white placeholder:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-teal-200/90 mb-1">
                Adresse e-mail (suivi des résultats & synthèse PDF) <span className="text-amber-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="votre.email@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#051f26] border border-teal-700/60 text-white placeholder:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#06242b] font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Enregistrement en cours...</span>
                ) : (
                  <>
                    <span>Valider et passer aux règles (Étape 2)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto w-full pt-4 flex items-center justify-between text-xs text-teal-300/60">
        <button onClick={onBack} className="hover:text-teal-200 underline">
          ← Retour à l'accueil
        </button>
        <span>Accès sécurisé pour 40 participants maximum</span>
      </div>
    </div>
  );
};
