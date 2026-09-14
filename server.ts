import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

interface AnswerRecord {
  questionId: number;
  selectedOptions: string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeTakenSeconds: number;
  timedOut: boolean;
  submittedAt: string;
}

interface ParticipantRecord {
  id: string;
  nom: string;
  prenom: string;
  secteur: string;
  reseau: string;
  email: string;
  registeredAt: string;
  lastActiveAt: string;
  currentQuestionIndex: number;
  completed: boolean;
  completedAt?: string;
  totalScore: number;
  answers: Record<number, AnswerRecord>;
}

// In-memory store backed by file storage
const DATA_FILE = path.join(process.cwd(), 'participants_data.json');
let participants: Record<string, ParticipantRecord> = {};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      participants = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading participants data:', err);
    participants = {};
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(participants, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving participants data:', err);
  }
}

loadData();

// Questions reference for server-side score calculation
const QUESTIONS_KEY: Record<number, { points: number; correctAnswers: string[]; part: 'A' | 'B' | 'C' | 'D' | 'E' }> = {
  1: { points: 2, correctAnswers: ['b'], part: 'A' },
  2: { points: 1, correctAnswers: ['c'], part: 'A' },
  3: { points: 3, correctAnswers: ['b'], part: 'A' },
  4: { points: 3, correctAnswers: ['a', 'b', 'c'], part: 'A' },
  5: { points: 1, correctAnswers: ['c'], part: 'A' },
  6: { points: 2, correctAnswers: ['b'], part: 'A' },
  7: { points: 4, correctAnswers: ['a', 'b', 'c', 'd'], part: 'B' },
  8: { points: 3, correctAnswers: ['b'], part: 'B' },
  9: { points: 1, correctAnswers: ['b'], part: 'B' },
  10: { points: 2, correctAnswers: ['b'], part: 'B' },
  11: { points: 3, correctAnswers: ['b'], part: 'C' },
  12: { points: 2, correctAnswers: ['a', 'b', 'c'], part: 'C' },
  13: { points: 1, correctAnswers: ['b'], part: 'C' },
  14: { points: 2, correctAnswers: ['b'], part: 'D' },
  15: { points: 1, correctAnswers: ['b'], part: 'D' },
  16: { points: 1, correctAnswers: ['b'], part: 'D' },
  17: { points: 1, correctAnswers: ['b'], part: 'D' },
  18: { points: 1, correctAnswers: ['a'], part: 'D' },
  19: { points: 1, correctAnswers: ['b'], part: 'D' },
  20: { points: 3, correctAnswers: ['a', 'b', 'c'], part: 'D' },
  21: { points: 3, correctAnswers: ['b'], part: 'E' },
  22: { points: 3, correctAnswers: ['b'], part: 'E' },
  23: { points: 6, correctAnswers: ['c'], part: 'E' },
};

// API: Register a participant
app.post('/api/register', (req, res) => {
  const { nom, prenom, secteur, reseau, email } = req.body;

  if (!nom || !prenom || !secteur || !reseau || !email) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  // Generate clean unique ID
  const id = 'cand_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const newParticipant: ParticipantRecord = {
    id,
    nom: nom.trim(),
    prenom: prenom.trim(),
    secteur: secteur.trim(),
    reseau: reseau.trim(),
    email: email.trim().toLowerCase(),
    registeredAt: now,
    lastActiveAt: now,
    currentQuestionIndex: 0,
    completed: false,
    totalScore: 0,
    answers: {},
  };

  participants[id] = newParticipant;
  saveData();

  res.json({ success: true, participant: newParticipant });
});

// API: Get participant
app.get('/api/participant/:id', (req, res) => {
  const p = participants[req.params.id];
  if (!p) {
    return res.status(404).json({ error: 'Participant introuvable' });
  }
  res.json({ participant: p });
});

// API: Submit answer for a question
app.post('/api/answer', (req, res) => {
  const { participantId, questionId, selectedOptions, timeTakenSeconds, timedOut } = req.body;

  const p = participants[participantId];
  if (!p) {
    return res.status(404).json({ error: 'Participant non trouvé' });
  }

  const qMeta = QUESTIONS_KEY[questionId];
  if (!qMeta) {
    return res.status(400).json({ error: 'Question invalide' });
  }

  const userSelection: string[] = Array.isArray(selectedOptions) ? selectedOptions : [];
  const sortedUser = [...userSelection].sort();
  const sortedCorrect = [...qMeta.correctAnswers].sort();

  // Si au moins une réponse a été sélectionnée, on la vérifie et on attribue le score (même à l'expiration du chrono).
  // Si aucune réponse n'a été sélectionnée, on attribue 0 point.
  const hasSelection = userSelection.length > 0;
  const isCorrect =
    hasSelection &&
    sortedUser.length === sortedCorrect.length &&
    sortedUser.every((val, idx) => val === sortedCorrect[idx]);

  const pointsEarned = isCorrect ? qMeta.points : 0;

  // Record answer
  p.answers[questionId] = {
    questionId,
    selectedOptions: userSelection,
    isCorrect,
    pointsEarned,
    timeTakenSeconds: timeTakenSeconds || 0,
    timedOut: Boolean(timedOut),
    submittedAt: new Date().toISOString(),
  };

  // Recalculate total score
  p.totalScore = Object.values(p.answers).reduce((acc, ans) => acc + ans.pointsEarned, 0);
  p.currentQuestionIndex = Math.max(p.currentQuestionIndex, questionId);
  p.lastActiveAt = new Date().toISOString();

  saveData();

  res.json({
    success: true,
    totalScore: p.totalScore,
    currentQuestionIndex: p.currentQuestionIndex,
    answerRecord: p.answers[questionId],
  });
});

// API: Complete quiz
app.post('/api/complete', (req, res) => {
  const { participantId } = req.body;
  const p = participants[participantId];
  if (!p) {
    return res.status(404).json({ error: 'Participant non trouvé' });
  }

  p.completed = true;
  p.completedAt = new Date().toISOString();
  p.lastActiveAt = p.completedAt;
  p.totalScore = Object.values(p.answers).reduce((acc, ans) => acc + ans.pointsEarned, 0);

  saveData();

  res.json({ success: true, participant: p });
});

// API: Admin live dashboard
app.get('/api/admin/live', (req, res) => {
  const list = Object.values(participants);

  const total = list.length;
  const completedCount = list.filter((p) => p.completed).length;
  const inProgressCount = list.filter((p) => !p.completed && p.currentQuestionIndex > 0).length;
  const validatedCount = list.filter((p) => p.completed && p.totalScore >= 40).length;
  const supportCount = list.filter((p) => p.completed && p.totalScore >= 30 && p.totalScore < 40).length;
  const retakeCount = list.filter((p) => p.completed && p.totalScore < 30).length;

  const averageScore = completedCount > 0
    ? Math.round(
        (list.filter((p) => p.completed).reduce((acc, p) => acc + p.totalScore, 0) / completedCount) * 10
      ) / 10
    : 0;

  // Question difficulty stats
  const questionStats: Record<number, { correct: number; total: number; successRate: number }> = {};
  for (let q = 1; q <= 23; q++) {
    let qTotal = 0;
    let qCorrect = 0;
    list.forEach((p) => {
      if (p.answers[q]) {
        qTotal++;
        if (p.answers[q].isCorrect) {
          qCorrect++;
        }
      }
    });
    questionStats[q] = {
      correct: qCorrect,
      total: qTotal,
      successRate: qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0,
    };
  }

  // Section performance stats (Moyenne par section)
  const SECTIONS_CONFIG: Record<'A' | 'B' | 'C' | 'D' | 'E', { title: string; maxPoints: number; questionCount: number }> = {
    A: { title: 'Le Socle Scientifique', maxPoints: 12, questionCount: 6 },
    B: { title: 'Les 4 EXTRA', maxPoints: 10, questionCount: 4 },
    C: { title: 'Indications et Réglementaire', maxPoints: 6, questionCount: 3 },
    D: { title: 'EXTRA MAG® et STREX®', maxPoints: 10, questionCount: 7 },
    E: { title: 'Mise en situation', maxPoints: 12, questionCount: 3 },
  };

  const sectionStats: Record<'A' | 'B' | 'C' | 'D' | 'E', {
    part: 'A' | 'B' | 'C' | 'D' | 'E';
    title: string;
    maxPoints: number;
    questionCount: number;
    averageScore: number;
    averagePercentage: number;
    respondentsCount: number;
  }> = {
    A: { part: 'A', ...SECTIONS_CONFIG.A, averageScore: 0, averagePercentage: 0, respondentsCount: 0 },
    B: { part: 'B', ...SECTIONS_CONFIG.B, averageScore: 0, averagePercentage: 0, respondentsCount: 0 },
    C: { part: 'C', ...SECTIONS_CONFIG.C, averageScore: 0, averagePercentage: 0, respondentsCount: 0 },
    D: { part: 'D', ...SECTIONS_CONFIG.D, averageScore: 0, averagePercentage: 0, respondentsCount: 0 },
    E: { part: 'E', ...SECTIONS_CONFIG.E, averageScore: 0, averagePercentage: 0, respondentsCount: 0 },
  };

  (['A', 'B', 'C', 'D', 'E'] as const).forEach((part) => {
    const questionsInPart = Object.entries(QUESTIONS_KEY)
      .filter(([_, meta]) => meta.part === part)
      .map(([id]) => Number(id));

    let totalPointsAccumulated = 0;
    let participantsWithAnswers = 0;

    list.forEach((p) => {
      // Check if participant has answered any question in this section
      const answeredInPart = questionsInPart.filter((qid) => p.answers[qid] !== undefined);
      if (answeredInPart.length > 0) {
        participantsWithAnswers++;
        const pointsInPart = answeredInPart.reduce((acc, qid) => acc + (p.answers[qid]?.pointsEarned || 0), 0);
        totalPointsAccumulated += pointsInPart;
      }
    });

    const maxPts = SECTIONS_CONFIG[part].maxPoints;
    const avgScore = participantsWithAnswers > 0
      ? Math.round((totalPointsAccumulated / participantsWithAnswers) * 10) / 10
      : 0;
    const avgPct = maxPts > 0 ? Math.round((avgScore / maxPts) * 100) : 0;

    sectionStats[part] = {
      part,
      title: SECTIONS_CONFIG[part].title,
      maxPoints: maxPts,
      questionCount: SECTIONS_CONFIG[part].questionCount,
      averageScore: avgScore,
      averagePercentage: avgPct,
      respondentsCount: participantsWithAnswers,
    };
  });

  // Analyse par Réseau
  const networkMap: Record<string, typeof list> = {};
  list.forEach((p) => {
    const net = (p.reseau || 'Non renseigné').trim();
    if (!networkMap[net]) networkMap[net] = [];
    networkMap[net].push(p);
  });

  const networkStats = Object.entries(networkMap).map(([netName, members]) => {
    const totalP = members.length;
    const completedList = members.filter((m) => m.completed);
    const completedCount = completedList.length;
    const inProgressCount = totalP - completedCount;
    const valCount = members.filter((m) => m.completed && m.totalScore >= 40).length;
    const suppCount = members.filter((m) => m.completed && m.totalScore >= 30 && m.totalScore < 40).length;
    const retCount = members.filter((m) => m.completed && m.totalScore < 30).length;

    // Use completed members for average if any exist, otherwise calculate across all active
    const pool = completedList.length > 0 ? completedList : members;
    const avgScore = pool.length > 0
      ? Math.round((pool.reduce((acc, m) => acc + m.totalScore, 0) / pool.length) * 10) / 10
      : 0;
    const avgPct = Math.round((avgScore / 50) * 100);

    const highestScore = members.reduce((max, m) => Math.max(max, m.totalScore), 0);
    const lowestScore = members.reduce((min, m) => Math.min(min, m.totalScore), 50);

    const validationRate = completedCount > 0
      ? Math.round((valCount / completedCount) * 100)
      : (totalP > 0 ? Math.round((valCount / totalP) * 100) : 0);

    const sectorsInNet = Array.from(new Set(members.map((m) => m.secteur).filter(Boolean)));

    return {
      name: netName,
      totalParticipants: totalP,
      completedCount,
      inProgressCount,
      averageScore: avgScore,
      averagePercentage: avgPct,
      highestScore,
      lowestScore: lowestScore === 50 && members.length === 0 ? 0 : lowestScore,
      validatedCount: valCount,
      supportCount: suppCount,
      retakeCount: retCount,
      validationRate,
      subGroups: sectorsInNet,
    };
  }).sort((a, b) => b.averageScore - a.averageScore);

  // Analyse par Secteur
  const sectorMap: Record<string, typeof list> = {};
  list.forEach((p) => {
    const sec = (p.secteur || 'Non renseigné').trim();
    if (!sectorMap[sec]) sectorMap[sec] = [];
    sectorMap[sec].push(p);
  });

  const sectorStats = Object.entries(sectorMap).map(([secName, members]) => {
    const totalP = members.length;
    const completedList = members.filter((m) => m.completed);
    const completedCount = completedList.length;
    const inProgressCount = totalP - completedCount;
    const valCount = members.filter((m) => m.completed && m.totalScore >= 40).length;
    const suppCount = members.filter((m) => m.completed && m.totalScore >= 30 && m.totalScore < 40).length;
    const retCount = members.filter((m) => m.completed && m.totalScore < 30).length;

    const pool = completedList.length > 0 ? completedList : members;
    const avgScore = pool.length > 0
      ? Math.round((pool.reduce((acc, m) => acc + m.totalScore, 0) / pool.length) * 10) / 10
      : 0;
    const avgPct = Math.round((avgScore / 50) * 100);

    const highestScore = members.reduce((max, m) => Math.max(max, m.totalScore), 0);
    const lowestScore = members.reduce((min, m) => Math.min(min, m.totalScore), 50);

    const validationRate = completedCount > 0
      ? Math.round((valCount / completedCount) * 100)
      : (totalP > 0 ? Math.round((valCount / totalP) * 100) : 0);

    const networksInSec = Array.from(new Set(members.map((m) => m.reseau).filter(Boolean)));

    return {
      name: secName,
      totalParticipants: totalP,
      completedCount,
      inProgressCount,
      averageScore: avgScore,
      averagePercentage: avgPct,
      highestScore,
      lowestScore: lowestScore === 50 && members.length === 0 ? 0 : lowestScore,
      validatedCount: valCount,
      supportCount: suppCount,
      retakeCount: retCount,
      validationRate,
      subGroups: networksInSec,
    };
  }).sort((a, b) => b.averageScore - a.averageScore);

  // Sorted list: completed high scorers first, then active
  const sorted = [...list].sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return b.totalScore - a.totalScore;
  });

  res.json({
    summary: {
      total,
      completedCount,
      inProgressCount,
      validatedCount,
      supportCount,
      retakeCount,
      averageScore,
    },
    sectionStats,
    networkStats,
    sectorStats,
    questionStats,
    participants: sorted,
  });
});

// API: Seed demo participants (convenient for demonstrating 40 participants live)
app.post('/api/admin/seed-demo', (req, res) => {
  const demoCandidates = [
    { nom: 'Trabelsi', prenom: 'Amine', secteur: 'Tunis Nord', reseau: 'Pharmasud' },
    { nom: 'Ben Salem', prenom: 'Yosra', secteur: 'Sousse Ville', reseau: 'Sahel Santé' },
    { nom: 'Bouazizi', prenom: 'Karim', secteur: 'Sfax Centre', reseau: 'Méditerranée' },
    { nom: 'Gharbi', prenom: 'Ines', secteur: 'Nabeul', reseau: 'Cap Bon' },
    { nom: 'Mejri', prenom: 'Mohamed', secteur: 'Bizerte', reseau: 'Nord Pharma' },
    { nom: 'Khemiri', prenom: 'Sonia', secteur: 'Ariana', reseau: 'Grand Tunis' },
    { nom: 'Chahed', prenom: 'Tarek', secteur: 'Tunis Sud', reseau: 'Alliance' },
    { nom: 'Dridi', prenom: 'Nadia', secteur: 'Monastir', reseau: 'Sahel Santé' },
    { nom: 'Jebali', prenom: 'Wassim', secteur: 'Kairouan', reseau: 'Centre Ouest' },
    { nom: 'Mansour', prenom: 'Leila', secteur: 'Gabès', reseau: 'Sud Pharma' },
    { nom: 'Baccouche', prenom: 'Hamza', secteur: 'La Marsa', reseau: 'Grand Tunis' },
    { nom: 'Zitouni', prenom: 'Fatma', secteur: 'Mahdia', reseau: 'Sahel Santé' },
    { nom: 'Slimane', prenom: 'Anis', secteur: 'Médenine', reseau: 'Sud Pharma' },
    { nom: 'Ayari', prenom: 'Rania', secteur: 'Ben Arous', reseau: 'Alliance' },
    { nom: 'Gannouni', prenom: 'Mehdi', secteur: 'Béja', reseau: 'Nord Ouest' },
    { nom: 'Toumi', prenom: 'Selma', secteur: 'Sfax Sud', reseau: 'Méditerranée' },
    { nom: 'Masmoudi', prenom: 'Firas', secteur: 'Sfax Nord', reseau: 'Méditerranée' },
    { nom: 'Haddad', prenom: 'Meriem', secteur: 'Tunis Ouest', reseau: 'Pharmasud' },
    { nom: 'Kacem', prenom: 'Sofiene', secteur: 'Hammamet', reseau: 'Cap Bon' },
    { nom: 'Ben Ammar', prenom: 'Cyrine', secteur: 'Carthage', reseau: 'Grand Tunis' },
    { nom: 'Zouari', prenom: 'Walid', secteur: 'Sousse Kantaoui', reseau: 'Sahel Santé' },
    { nom: 'Ouali', prenom: 'Hajer', secteur: 'Gafsa', reseau: 'Sud Ouest' },
    { nom: 'Abidi', prenom: 'Zied', secteur: 'Jendouba', reseau: 'Nord Ouest' },
    { nom: 'Belhadj', prenom: 'Dorra', secteur: 'Manouba', reseau: 'Alliance' },
    { nom: 'Ben Salah', prenom: 'Kmar', secteur: 'Zarzis', reseau: 'Sud Pharma' },
    { nom: 'Farhat', prenom: 'Oussama', secteur: 'Kasserine', reseau: 'Centre Ouest' },
    { nom: 'Marzouki', prenom: 'Asma', secteur: 'Tataouine', reseau: 'Sud Pharma' },
    { nom: 'Cherif', prenom: 'Bilel', secteur: 'Zaghouan', reseau: 'Cap Bon' },
    { nom: 'Hammami', prenom: 'Khaoula', secteur: 'Siliana', reseau: 'Nord Ouest' },
    { nom: 'Bouzid', prenom: 'Riadh', secteur: 'Le Kef', reseau: 'Nord Ouest' },
    { nom: 'Letaief', prenom: 'Mariem', secteur: 'Tozeur', reseau: 'Sud Ouest' },
    { nom: 'Gouiaa', prenom: 'Moez', secteur: 'Ennasr', reseau: 'Grand Tunis' },
    { nom: 'Hassine', prenom: 'Nour', secteur: 'El Menzah', reseau: 'Pharmasud' },
    { nom: 'Khlifi', prenom: 'Sami', secteur: 'Menzah 9', reseau: 'Pharmasud' },
    { nom: 'Brahim', prenom: 'Imen', secteur: 'Lac 2', reseau: 'Grand Tunis' },
    { nom: 'Nasri', prenom: 'Adel', secteur: 'Sidi Bouzid', reseau: 'Centre Ouest' },
    { nom: 'Youssef', prenom: 'Arij', secteur: 'Mornag', reseau: 'Cap Bon' },
    { nom: 'Mahjoub', prenom: 'Faouzi', secteur: 'Kelibia', reseau: 'Cap Bon' },
    { nom: 'Saidi', prenom: 'Chiraz', secteur: 'Mateur', reseau: 'Nord Pharma' },
    { nom: 'Triki', prenom: 'Nizar', secteur: 'Sakiet Ezzit', reseau: 'Méditerranée' },
  ];

  const now = new Date();

  demoCandidates.forEach((c, idx) => {
    const id = `cand_seed_${idx + 1}`;
    // Some are fully finished with varying grades, some are currently taking the quiz
    const isCompleted = idx < 32; // 32 finished, 8 in progress
    const currentQ = isCompleted ? 23 : 5 + (idx % 15);
    const answers: Record<number, AnswerRecord> = {};
    let score = 0;

    for (let q = 1; q <= currentQ; q++) {
      const qMeta = QUESTIONS_KEY[q];
      // Probability of answering correctly: 80% for top performers, 60% average
      const passes = idx < 18 ? Math.random() > 0.15 : Math.random() > 0.35;
      const selected = passes ? qMeta.correctAnswers : ['wrong'];
      const points = passes ? qMeta.points : 0;
      score += points;

      answers[q] = {
        questionId: q,
        selectedOptions: selected,
        isCorrect: passes,
        pointsEarned: points,
        timeTakenSeconds: Math.floor(15 + Math.random() * 25),
        timedOut: false,
        submittedAt: new Date(now.getTime() - (25 - q) * 45000).toISOString(),
      };
    }

    participants[id] = {
      id,
      nom: c.nom,
      prenom: c.prenom,
      secteur: c.secteur,
      reseau: c.reseau,
      email: `${c.prenom.toLowerCase()}.${c.nom.toLowerCase().replace(/\s+/g, '')}@pharma-rep.tn`,
      registeredAt: new Date(now.getTime() - 25 * 60000).toISOString(),
      lastActiveAt: new Date().toISOString(),
      currentQuestionIndex: currentQ,
      completed: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      totalScore: score,
      answers,
    };
  });

  saveData();
  res.json({ success: true, count: Object.keys(participants).length });
});

// API: Reset all data
app.post('/api/admin/reset', (req, res) => {
  participants = {};
  saveData();
  res.json({ success: true });
});

// Setup Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quiz server running on http://localhost:${PORT}`);
  });
}

startServer();
