import jsPDF from 'jspdf';
import { Participant, QuizResultSummary } from '../types';
import { QUESTIONS, getStatusFromScore } from '../data/quizData';

export function generateQuizResultPdf(summary: QuizResultSummary) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { participant, totalPoints, maxPoints, percentage, sectionBreakdown } = summary;
  const statusInfo = getStatusFromScore(totalPoints);

  // Background banner header
  doc.setFillColor(6, 36, 43); // Deep petrol teal #06242b
  doc.rect(0, 0, 210, 48, 'F');

  // Decorative teal curve / circle
  doc.setFillColor(16, 163, 148); // Vibrant teal
  doc.circle(200, 10, 25, 'F');

  // Header texts
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 220, 215);
  doc.text('É L E M E N T S   P H A R M A   |   F O R M A T I O N   E X T R A   M A G ®', 14, 14);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('RAPPORT DU QUIZ DE VALIDATION', 14, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(230, 245, 242);
  doc.text(`Document officiel d'évaluation individuelle · Extra MAG® (23 questions)`, 14, 34);

  // Participant Identity Box
  doc.setFillColor(245, 249, 250);
  doc.setDrawColor(200, 225, 225);
  doc.roundedRect(14, 54, 182, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 40, 48);
  doc.text(`CANDIDAT : ${participant.prenom.toUpperCase()} ${participant.nom.toUpperCase()}`, 18, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 90, 95);
  doc.text(`Secteur : ${participant.secteur}`, 18, 69);
  doc.text(`Réseau : ${participant.reseau}`, 90, 69);
  doc.text(`E-mail : ${participant.email}`, 18, 76);
  const dateStr = participant.completedAt ? new Date(participant.completedAt).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR');
  doc.text(`Date & Heure : ${dateStr}`, 90, 76);

  // Score & Status Badges Box
  let badgeColor = [16, 185, 129]; // Green
  if (statusInfo.status === 'validated_with_support') {
    badgeColor = [217, 119, 6]; // Amber
  } else if (statusInfo.status === 'retake') {
    badgeColor = [225, 29, 72]; // Rose
  }

  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(14, 86, 182, 24, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`SCORE GLOBAL : ${totalPoints} / ${maxPoints} POINTS (${percentage}%)`, 20, 98);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`VERDICT : ${statusInfo.label.toUpperCase()}`, 20, 105);

  // Sections breakdown table
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 40, 48);
  doc.text('RÉSULTATS PAR DOMAINE SCIENTIFIQUE & COMMERCIAL', 14, 120);

  let currentY = 126;
  doc.setFillColor(235, 243, 245);
  doc.rect(14, currentY, 182, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 40, 48);
  doc.text('PARTIE', 16, currentY + 5);
  doc.text('INTITULÉ', 35, currentY + 5);
  doc.text('QUESTIONS', 120, currentY + 5);
  doc.text('SCORE OBTENU', 155, currentY + 5);

  currentY += 7;

  sectionBreakdown.forEach((sec, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 252, 252);
      doc.rect(14, currentY, 182, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 60, 65);
    doc.text(`Partie ${sec.part}`, 16, currentY + 4.5);
    doc.text(sec.title, 35, currentY + 4.5);
    doc.text(`${sec.correctCount} / ${sec.totalCount} correctes`, 120, currentY + 4.5);

    const secPercentage = Math.round((sec.pointsEarned / sec.maxPoints) * 100);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sec.pointsEarned} / ${sec.maxPoints} pts (${secPercentage}%)`, 155, currentY + 4.5);

    currentY += 6.5;
  });

  // Questions detail list
  currentY += 6;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 40, 48);
  doc.text('DÉTAIL DES 23 QUESTIONS DU QUIZ (RÉPONSES VS CORRIGÉ)', 14, currentY);

  currentY += 6;
  doc.setFillColor(6, 36, 43);
  doc.rect(14, currentY, 182, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Q#', 16, currentY + 4.5);
  doc.text('ÉVALUATION / PARTIE', 26, currentY + 4.5);
  doc.text('VOTRE RÉPONSE', 110, currentY + 4.5);
  doc.text('CORRIGÉ OFFICIEL', 145, currentY + 4.5);
  doc.text('PTS', 185, currentY + 4.5);

  currentY += 6.5;

  QUESTIONS.forEach((q) => {
    // Check for page break
    if (currentY > 275) {
      doc.addPage();
      currentY = 16;
      doc.setFillColor(6, 36, 43);
      doc.rect(14, currentY, 182, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('Q#', 16, currentY + 4.5);
      doc.text('ÉVALUATION / PARTIE', 26, currentY + 4.5);
      doc.text('VOTRE RÉPONSE', 110, currentY + 4.5);
      doc.text('CORRIGÉ OFFICIEL', 145, currentY + 4.5);
      doc.text('PTS', 185, currentY + 4.5);
      currentY += 6.5;
    }

    const ans = participant.answers[q.id];
    const isCorrect = ans?.isCorrect ?? false;
    const userChoices = ans?.selectedOptions?.join(' + ') || (ans?.timedOut ? 'Temps expiré' : 'Non répondu');
    const correctChoices = q.correctAnswers.join(' + ');

    if (isCorrect) {
      doc.setFillColor(240, 253, 244); // light green
    } else {
      doc.setFillColor(254, 242, 242); // light red
    }
    doc.rect(14, currentY, 182, 6.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isCorrect ? 22 : 185, isCorrect ? 101 : 28, isCorrect ? 52 : 28);
    doc.text(`Q${q.id}`, 16, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 60, 65);
    const shortTitle = q.question.length > 52 ? q.question.substring(0, 52) + '...' : q.question;
    doc.text(`Partie ${q.part} · ${shortTitle}`, 26, currentY + 4.2);

    doc.text(userChoices, 110, currentY + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.text(correctChoices, 145, currentY + 4.2);

    doc.text(`${ans?.pointsEarned ?? 0}/${q.points}`, 185, currentY + 4.2);

    currentY += 6.2;
  });

  // Footer bar on last page
  currentY += 6;
  if (currentY > 275) {
    doc.addPage();
    currentY = 20;
  }
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 115, 120);
  doc.text(
    'Barème officiel : 40 pts et plus = Validé · 30 à 39 pts = Validé avec accompagnement · Moins de 30 pts = Reprise.',
    14,
    currentY
  );
  doc.text(
    'Document certifié généré par la plateforme de formation Éléments Pharma · Formation Extra MAG®.',
    14,
    currentY + 4.5
  );

  // Save PDF
  const filename = `Quiz_ExtraMag_Resultat_${participant.nom}_${participant.prenom}.pdf`.replace(/\s+/g, '_');
  doc.save(filename);
}
