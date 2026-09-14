import React, { useState, useEffect } from 'react';
import { Participant, QuestionPart } from './types';
import { QUESTIONS, SECTIONS, TOTAL_QUESTIONS } from './data/quizData';
import { PageWelcome } from './components/PageWelcome';
import { PageRegister } from './components/PageRegister';
import { PageRules } from './components/PageRules';
import { PageSectionIntro } from './components/PageSectionIntro';
import { PageQuestion } from './components/PageQuestion';
import { PageResult } from './components/PageResult';
import { AdminDashboard } from './components/AdminDashboard';

type AppScreen =
  | 'welcome'
  | 'register'
  | 'rules'
  | 'section_intro'
  | 'question'
  | 'result'
  | 'admin';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // 0 to 22
  const [cumulativeScore, setCumulativeScore] = useState<number>(0);
  const [activeSectionPart, setActiveSectionPart] = useState<QuestionPart>('A');

  // Load any existing session from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('extramag_quiz_participant');
      if (saved) {
        const p: Participant = JSON.parse(saved);
        setParticipant(p);
        setCumulativeScore(p.totalScore || 0);
        if (p.completed) {
          setScreen('result');
        }
      }
    } catch (e) {
      console.warn('Could not parse local participant:', e);
    }
  }, []);

  // Save participant session whenever updated
  const updateParticipant = (updated: Participant) => {
    setParticipant(updated);
    setCumulativeScore(updated.totalScore);
    try {
      localStorage.setItem('extramag_quiz_participant', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Step 1: Start from welcome
  const handleStartFromWelcome = () => {
    if (participant && !participant.completed) {
      setScreen('rules');
    } else {
      setScreen('register');
    }
  };

  // Step 2: Registered
  const handleRegistered = (p: Participant) => {
    updateParticipant(p);
    setScreen('rules');
  };

  // Step 3: Rules agreed -> Launch Section A Intro
  const handleStartQuizFromRules = () => {
    setCurrentQuestionIndex(0);
    setActiveSectionPart('A');
    setScreen('section_intro');
  };

  // Step 4: Section intro proceed -> Show question
  const handleProceedFromSectionIntro = () => {
    setScreen('question');
  };

  // Step 5: Question answer submit (manual or timeout)
  const handleAnswerSubmit = async (
    selectedOptions: string[],
    timeTaken: number,
    timedOut: boolean
  ) => {
    const currentQ = QUESTIONS[currentQuestionIndex];
    if (!currentQ || !participant) return;

    // Send answer to server
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participant.id,
          questionId: currentQ.id,
          selectedOptions,
          timeTakenSeconds: timeTaken,
          timedOut,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedAnswers = {
          ...participant.answers,
          [currentQ.id]: data.answerRecord,
        };

        const updatedParticipant: Participant = {
          ...participant,
          currentQuestionIndex: currentQ.id,
          totalScore: data.totalScore,
          answers: updatedAnswers,
        };

        updateParticipant(updatedParticipant);
      } else {
        // Fallback local calculation
        fallbackCalculateScore(currentQ, selectedOptions, timeTaken, timedOut);
      }
    } catch (e) {
      // Offline fallback
      fallbackCalculateScore(currentQ, selectedOptions, timeTaken, timedOut);
    }

    // Determine next step (forward-only linear transition)
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= TOTAL_QUESTIONS) {
      // Finished all 23 questions!
      await handleCompleteQuiz();
    } else {
      const nextQ = QUESTIONS[nextIndex];
      setCurrentQuestionIndex(nextIndex);

      // If next question belongs to a new section, display section transition slide!
      if (nextQ.part !== currentQ.part) {
        setActiveSectionPart(nextQ.part);
        setScreen('section_intro');
      } else {
        setScreen('question');
      }
    }
  };

  const fallbackCalculateScore = (
    currentQ: typeof QUESTIONS[0],
    selectedOptions: string[],
    timeTaken: number,
    timedOut: boolean
  ) => {
    if (!participant) return;
    const sortedUser = [...selectedOptions].sort();
    const sortedCorrect = [...currentQ.correctAnswers].sort();
    // Si au moins une réponse a été sélectionnée, on vérifie l'exactitude
    // Si aucune réponse sélectionnée, score = 0
    const hasSelection = sortedUser.length > 0;
    const isCorrect =
      hasSelection &&
      sortedUser.length === sortedCorrect.length &&
      sortedUser.every((val, idx) => val === sortedCorrect[idx]);

    const pointsEarned = isCorrect ? currentQ.points : 0;
    const newAnswers = {
      ...participant.answers,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOptions,
        isCorrect,
        pointsEarned,
        timeTakenSeconds: timeTaken,
        timedOut,
        submittedAt: new Date().toISOString(),
      },
    };

    const newScore = Object.values(newAnswers).reduce(
      (acc: number, a) => acc + (a ? (a as { pointsEarned: number }).pointsEarned : 0),
      0
    );

    const updatedParticipant: Participant = {
      ...participant,
      currentQuestionIndex: currentQ.id,
      totalScore: newScore,
      answers: newAnswers,
    };
    updateParticipant(updatedParticipant);
  };

  const handleCompleteQuiz = async () => {
    if (!participant) return;

    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participant.id }),
      });
      if (res.ok) {
        const data = await res.json();
        updateParticipant(data.participant);
      } else {
        updateParticipant({
          ...participant,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      updateParticipant({
        ...participant,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }

    setScreen('result');
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem('extramag_quiz_participant');
    } catch (e) {
      console.warn(e);
    }
    setParticipant(null);
    setCurrentQuestionIndex(0);
    setCumulativeScore(0);
    setScreen('welcome');
  };

  return (
    <div className="font-sans antialiased">
      {screen === 'welcome' && (
        <PageWelcome
          onStart={handleStartFromWelcome}
          onOpenAdmin={() => setScreen('admin')}
        />
      )}

      {screen === 'register' && (
        <PageRegister
          onRegistered={handleRegistered}
          onBack={() => setScreen('welcome')}
        />
      )}

      {screen === 'rules' && participant && (
        <PageRules
          participant={participant}
          onProceed={handleStartQuizFromRules}
          onBack={() => setScreen('register')}
        />
      )}

      {screen === 'section_intro' && (
        <PageSectionIntro
          section={SECTIONS[activeSectionPart]}
          onProceed={handleProceedFromSectionIntro}
        />
      )}

      {screen === 'question' && (
        <PageQuestion
          question={QUESTIONS[currentQuestionIndex]}
          totalQuestions={TOTAL_QUESTIONS}
          cumulativeScore={cumulativeScore}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {screen === 'result' && participant && (
        <PageResult
          participant={participant}
          onRestart={handleRestart}
          onOpenAdmin={() => setScreen('admin')}
        />
      )}

      {screen === 'admin' && (
        <AdminDashboard
          onBackToQuiz={() => {
            if (participant) {
              if (participant.completed) setScreen('result');
              else setScreen('question');
            } else {
              setScreen('welcome');
            }
          }}
        />
      )}
    </div>
  );
}
