import { Question, SectionInfo } from '../types';

export const SECTIONS: Record<string, SectionInfo> = {
  A: {
    part: 'A',
    title: 'LE SOCLE SCIENTIFIQUE',
    questionCount: 6,
    points: 12,
  },
  B: {
    part: 'B',
    title: 'LES 4 EXTRA',
    questionCount: 4,
    points: 10,
  },
  C: {
    part: 'C',
    title: 'INDICATIONS ET RÉGLEMENTAIRE',
    questionCount: 3,
    points: 6,
  },
  D: {
    part: 'D',
    title: 'EXTRA MAG® ET STREX®',
    questionCount: 7,
    points: 10,
  },
  E: {
    part: 'E',
    title: 'MISE EN SITUATION',
    questionCount: 3,
    points: 12,
  },
};

export const QUESTIONS: Question[] = [
  // PARTIE A: LE SOCLE SCIENTIFIQUE
  {
    id: 1,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 2,
    durationSeconds: 60,
    durationLabel: '1 min',
    question: "Un patient présente une magnésémie strictement normale. Pourquoi cela n'exclut-il pas un déficit ?",
    options: [
      { key: 'a', label: 'Le laboratoire mesure le magnésium total et non le magnésium ionisé' },
      { key: 'b', label: "Moins de 1 % du magnésium corporel est sanguin et l'os tamponne cette valeur pour la maintenir constante" },
      { key: 'c', label: 'La magnésémie varie fortement au cours de la journée' },
      { key: 'd', label: "Le déficit n'apparaît qu'après trois mois de carence" },
    ],
    correctAnswers: ['b'],
    explanation: "Moins de 1 % du magnésium se trouve dans le sérum sanguin. Le corps puise en permanence dans les réserves osseuses et cellulaires pour maintenir la magnésémie constante. Un dosage sérique normal masque donc très fréquemment un déficit tissulaire intracellulaire profond.",
  },
  {
    id: 2,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 40,
    durationLabel: '40 s',
    question: "Le magnésium marin est majoritairement composé de :",
    options: [
      { key: 'a', label: 'Citrate et malate' },
      { key: 'b', label: 'Bisglycinate et glycérophosphate' },
      { key: 'c', label: 'Oxyde et hydroxyde' },
      { key: 'd', label: 'Chlorure et lactate' },
    ],
    correctAnswers: ['c'],
    explanation: "Le magnésium d'origine marine issu de l'eau de mer après évaporation est principalement composé de sels inorganiques insolubles : oxyde et hydroxyde de magnésium, connus pour leur faible biodisponibilité et leurs effets secondaires digestifs.",
  },
  {
    id: 3,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 3,
    durationSeconds: 60,
    durationLabel: '1 min',
    question: "« Plus la teneur en magnésium élément affichée est élevée, plus le produit est efficace. »",
    subInstruction: "Choisissez le verdict ET sa justification.",
    options: [
      { key: 'a', label: 'VRAI — la teneur détermine directement la quantité absorbée' },
      { key: 'b', label: "FAUX — la teneur mesure ce que le patient avale, pas ce qu'il absorbe ; une forte teneur mal absorbée sature l'intestin" },
      { key: 'c', label: 'VRAI — à condition que la forme soit organique' },
      { key: 'd', label: "FAUX — le magnésium n'est jamais absorbé au-delà de 50 mg par prise" },
    ],
    correctAnswers: ['b'],
    explanation: "La biodisponibilité et l'absorption réelle priment sur la quantité brute ingérée. Une forte teneur sous forme mal absorbée (comme l'oxyde) n'est pas assimilée, stagne dans l'intestin et déclenche un appel d'eau osmotique responsable d'effets laxatifs.",
  },
  {
    id: 4,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'multiple',
    typeLabel: 'PLUSIEURS RÉPONSES',
    points: 3,
    durationSeconds: 75,
    durationLabel: "1'15",
    question: "Par quel mécanisme l'oxyde de magnésium provoque-t-il un effet laxatif ?",
    subInstruction: "Cochez les TROIS éléments corrects.",
    requiredCount: 3,
    options: [
      { key: 'a', label: 'Il est faiblement absorbé, moins de 10 %' },
      { key: 'b', label: 'La fraction non absorbée reste dans la lumière intestinale' },
      { key: 'c', label: "Elle y attire l'eau par effet osmotique" },
      { key: 'd', label: 'Il irrite directement la muqueuse intestinale' },
      { key: 'e', label: 'Il accélère le péristaltisme par action nerveuse' },
      { key: 'f', label: 'Il sature les récepteurs intestinaux du magnésium' },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation: "Le mécanisme laxatif des sels inorganiques repose sur : 1° une très faible absorption (< 10 %), 2° la rétention de plus de 90 % de la dose dans la lumière intestinale, 3° qui exerce une pression osmotique attirant l'eau dans la lumière colique.",
  },
  {
    id: 5,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 40,
    durationLabel: '40 s',
    question: "Par quelle voie le magnésium bisglycinate chélaté est-il principalement absorbé ?",
    options: [
      { key: 'a', label: 'La voie paracellulaire passive classique des minéraux' },
      { key: 'b', label: 'Les canaux TRPM6 et TRPM7 exclusivement' },
      { key: 'c', label: 'La voie de transport des dipeptides' },
      { key: 'd', label: 'La diffusion facilitée par la vitamine D' },
    ],
    correctAnswers: ['c'],
    explanation: "Grâce à sa liaison chélatée à 2 molécules de glycine, le magnésium bisglycinate traverse la barrière intestinale intact par les transporteurs de dipeptides (PEPT1), évitant la compétition minérale et les irritations digestives.",
  },
  {
    id: 6,
    part: 'A',
    partTitle: 'Socle scientifique',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 2,
    durationSeconds: 45,
    durationLabel: '45 s',
    question: "Classez ces formes de la plus ancienne génération à la plus évoluée :",
    options: [
      { key: 'a', label: 'Bisglycinate → citrate → oxyde' },
      { key: 'b', label: 'Oxyde → citrate → bisglycinate' },
      { key: 'c', label: 'Citrate → oxyde → bisglycinate' },
      { key: 'd', label: 'Oxyde → bisglycinate → citrate' },
    ],
    correctAnswers: ['b'],
    explanation: "1ère génération : sels inorganiques insolubles (oxyde, chlorure), 2ème génération : sels organiques solubles (citrate, lactate, gluconate), 3ème génération : chélates aminocomplexés de haute technologie (bisglycinate chélaté TRAACS®).",
  },

  // PARTIE B: LES 4 EXTRA
  {
    id: 7,
    part: 'B',
    partTitle: 'Les 4 EXTRA',
    type: 'multiple',
    typeLabel: 'PLUSIEURS RÉPONSES',
    points: 4,
    durationSeconds: 60,
    durationLabel: '1 min',
    question: "Quels sont les quatre EXTRA d'Extra MAG® ?",
    subInstruction: "Cochez les QUATRE piliers officiels.",
    requiredCount: 4,
    options: [
      { key: 'a', label: 'EXTRA ABSORPTION' },
      { key: 'b', label: 'EXTRA TOLÉRANCE' },
      { key: 'c', label: 'EXTRA SYNERGIE' },
      { key: 'd', label: 'EXTRA SIMPLICITÉ' },
      { key: 'e', label: 'EXTRA QUALITÉ' },
      { key: 'f', label: 'EXTRA FORMULE' },
      { key: 'g', label: 'EXTRA DOSAGE' },
    ],
    correctAnswers: ['a', 'b', 'c', 'd'],
    explanation: "Les 4 piliers officiels de la charte Extra MAG® sont : 1. EXTRA ABSORPTION (chélaté Albion TRAACS®), 2. EXTRA TOLÉRANCE (zéro effet laxatif), 3. EXTRA SYNERGIE (Magnésium + Vitamine B6 + Glycine), 4. EXTRA SIMPLICITÉ (1 gélule/jour).",
  },
  {
    id: 8,
    part: 'B',
    partTitle: 'Les 4 EXTRA',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 3,
    durationSeconds: 50,
    durationLabel: '50 s',
    question: "Combien d'actifs une gélule d'Extra MAG® apporte-t-elle, et lesquels ?",
    options: [
      { key: 'a', label: 'Deux : le magnésium et la vitamine B6' },
      { key: 'b', label: 'Trois : le magnésium, la vitamine B6 et la glycine' },
      { key: 'c', label: 'Un seul : le magnésium, la B6 étant un excipient' },
      { key: 'd', label: 'Trois : le magnésium, la vitamine B6 et la taurine' },
    ],
    correctAnswers: ['b'],
    explanation: "Correction commentée clé (Q8) : Une gélule d'Extra MAG® apporte 3 actifs majeurs : le magnésium, la vitamine B6 (cofacteur enzymatique facilitant l'entrée cellulaire) ET la glycine (acide aminé apaisant neuromédiateur qui constitue la molécule de chélation du bisglycinate).",
  },
  {
    id: 9,
    part: 'B',
    partTitle: 'Les 4 EXTRA',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 40,
    durationLabel: '40 s',
    question: "Devant un pharmacien, quels sont les deux EXTRA à privilégier ?",
    options: [
      { key: 'a', label: 'ABSORPTION et SYNERGIE' },
      { key: 'b', label: 'TOLÉRANCE et SIMPLICITÉ' },
      { key: 'c', label: 'ABSORPTION et SIMPLICITÉ' },
      { key: 'd', label: 'Les quatre systématiquement' },
    ],
    correctAnswers: ['b'],
    explanation: "Au comptoir de la pharmacie, les deux arguments décisifs pour le patient et le pharmacien sont la TOLÉRANCE (aucun trouble digestif, sécurisant le conseil) et la SIMPLICITÉ (observance garantie avec une seule prise quotidienne).",
  },
  {
    id: 10,
    part: 'B',
    partTitle: 'Les 4 EXTRA',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 2,
    durationSeconds: 55,
    durationLabel: '55 s',
    question: "Au comptoir, quelle posologie annoncez-vous, et que représente « 375 mg, 100 % de la VNR » ?",
    options: [
      { key: 'a', label: "3 gélules par jour ; c'est la posologie standard du produit" },
      { key: 'b', label: "1 gélule par jour ; les 375 mg correspondent à 3 gélules et relèvent du discours médical" },
      { key: 'c', label: "1 gélule par jour ; les 375 mg correspondent à une gélule prise à jeun" },
      { key: 'd', label: "2 gélules par jour ; les 375 mg sont la dose maximale de sécurité" },
    ],
    correctAnswers: ['b'],
    explanation: "La posologie comptoir standard est de 1 gélule par jour (125 mg de Mg élément hautement assimilable). La mention réglementaire 375 mg (100 % VNR) correspond à 3 gélules et est réservée aux prescriptions médicales renforcées.",
  },

  // PARTIE C: INDICATIONS ET RÉGLEMENTAIRE
  {
    id: 11,
    part: 'C',
    partTitle: 'Indications / réglementaire',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 3,
    durationSeconds: 70,
    durationLabel: "1'10",
    question: "Associez chaque profil au bon argument.\n1. Patient SII ayant échoué avec plusieurs magnésiums\n2. Femme se plaignant d'un SPM\n3. Patient sous IPP au long cours\n\na) Association magnésium et vitamine B6\nb) Déplétion médicamenteuse documentée\nc) Forme chélatée absorbée, sans effet osmotique",
    options: [
      { key: 'a', label: '1-a · 2-b · 3-c' },
      { key: 'b', label: '1-c · 2-a · 3-b' },
      { key: 'c', label: '1-b · 2-c · 3-a' },
      { key: 'd', label: '1-c · 2-b · 3-a' },
    ],
    correctAnswers: ['b'],
    explanation: "Association logique : 1-c (Syndrome de l'Intestin Irritable = forme chélatée sans effet osmotique digestif), 2-a (Syndrome Prémenstruel = synergie prouvée magnésium + vitamine B6 régulatrice hormonale), 3-b (IPP = inhibition de l'acidité gastrique provoquant une hypomagnésémie médicamenteuse reconnue).",
  },
  {
    id: 12,
    part: 'C',
    partTitle: 'Indications / réglementaire',
    type: 'multiple',
    typeLabel: 'PLUSIEURS RÉPONSES',
    points: 2,
    durationSeconds: 50,
    durationLabel: '50 s',
    question: "Quelles classes imposent d'espacer la prise d'Extra MAG® de deux heures ?",
    subInstruction: "Cochez les TROIS classes concernées.",
    requiredCount: 3,
    options: [
      { key: 'a', label: 'Cyclines' },
      { key: 'b', label: 'Fluoroquinolones' },
      { key: 'c', label: 'Bisphosphonates' },
      { key: 'd', label: 'Antihypertenseurs' },
      { key: 'e', label: 'Antihistaminiques' },
      { key: 'f', label: 'Statines' },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation: "Les cations divalents (Mg2+) chélatent et diminuent drastiquement la résorption digestive des Cyclines, des Fluoroquinolones et des Bisphosphonates. Un délai minimum de 2 heures d'intervalle de prise est obligatoire.",
  },
  {
    id: 13,
    part: 'C',
    partTitle: 'Indications / réglementaire',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 45,
    durationLabel: '45 s',
    question: "Un médecin demande si Extra MAG® « soigne les crampes ». Quelle formulation employez-vous ?",
    options: [
      { key: 'a', label: "« Oui, il traite les crampes d'origine magnésienne »" },
      { key: 'b', label: "« Il contribue à une fonction musculaire normale »" },
      { key: 'c', label: '« Il guérit les crampes en trois semaines »' },
      { key: 'd', label: '« Il réduit les crampes et les spasmes »' },
    ],
    correctAnswers: ['b'],
    explanation: "Conformément à la réglementation européenne et tunisienne sur les compléments alimentaires, aucune allégation thérapeutique de guérison ou de traitement de maladie ne peut être formulée. L'allégation autorisée par l'EFSA est : « contribue à une fonction musculaire normale ».",
  },

  // PARTIE D: EXTRA MAG® ET STREX®
  {
    id: 14,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 2,
    durationSeconds: 55,
    durationLabel: '55 s',
    question: "Un pharmacien vous dit : « C'est le même produit que STREX®. » Que répondez-vous ?",
    options: [
      { key: 'a', label: "« C'est effectivement la même base, mais le nôtre est plus dosé »" },
      { key: 'b', label: "« STREX® contient du magnésium ; Extra MAG® EST du magnésium »" },
      { key: 'c', label: "« Non, le nôtre est meilleur, STREX® est dépassé »" },
      { key: 'd', label: "« Ce sont deux magnésiums, mais Extra MAG® est moins cher »" },
    ],
    correctAnswers: ['b'],
    explanation: "Positionnement distinctif : STREX® est une formule complexe dédiée au stress aigu et aux troubles du sommeil contenant du magnésium parmi d'autres actifs (mélatonine, plantes), tandis qu'Extra MAG® EST le spécialiste du magnésium pur hautement biodisponible pour combler les déficits chroniques.",
  },
  {
    id: 15,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 40,
    durationLabel: '40 s',
    question: "Quel est le concurrent réel d'Extra MAG® ?",
    options: [
      { key: 'a', label: 'STREX® 2EN1' },
      { key: 'b', label: 'Les autres magnésiums : Magné B6®, les marins, les importés' },
      { key: 'c', label: 'Les somnifères légers' },
      { key: 'd', label: 'Les complexes de vitamines B' },
    ],
    correctAnswers: ['b'],
    explanation: "Correction commentée clé (Q15) : Le concurrent d'Extra MAG® n'est absolument pas STREX® (produit de notre propre gamme ciblant le stress/sommeil). Le vrai concurrent est l'ensemble des magnésiums classiques du marché : Magné B6®, les magnésiums marins faiblement absorbés et les marques d'importation.",
  },
  {
    id: 16,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 35,
    durationLabel: '35 s',
    question: "CAS 1 — Femme enceinte de 6 mois, crampes nocturnes.",
    options: [
      { key: 'a', label: 'STREX® — le stress de la grossesse justifie la formule complète' },
      { key: 'b', label: 'EXTRA MAG® — la mélatonine de STREX® NUIT est contre-indiquée' },
      { key: 'c', label: 'STREX® — la mélatonine améliore le sommeil de fin de grossesse' },
      { key: 'd', label: "EXTRA MAG® — parce qu'il est moins cher" },
    ],
    correctAnswers: ['b'],
    explanation: "Chez la femme enceinte, la mélatonine contenue dans STREX® NUIT est formellement déconseillée/contre-indiquée par précaution. Extra MAG® apporte le magnésium et la B6 en toute sécurité pour soulager les crampes de la grossesse.",
  },
  {
    id: 17,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 35,
    durationLabel: '35 s',
    question: "CAS 2 — Cadre de 42 ans, stressé, met deux heures à s'endormir.",
    options: [
      { key: 'a', label: 'EXTRA MAG® — le magnésium seul suffit pour le stress' },
      { key: 'b', label: 'STREX® — trouble du sommeil caractérisé, indication du programme 2EN1' },
      { key: 'c', label: "EXTRA MAG® — la glycine résout l'endormissement" },
      { key: 'd', label: 'Les deux en même temps' },
    ],
    correctAnswers: ['b'],
    explanation: "Devant une difficulté majeure d'endormissement (2 heures) avec composante de stress professionnel, la formule STREX® 2EN1 (action jour anti-stress + action nuit avec mélatonine régulatrice du cycle circadien) est l'indication de premier choix.",
  },
  {
    id: 18,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 35,
    durationLabel: '35 s',
    question: "CAS 3 — Sportif de 25 ans, crampes à l'effort.",
    options: [
      { key: 'a', label: 'EXTRA MAG® — besoin hors sphère nerveuse, fonction musculaire normale' },
      { key: 'b', label: "STREX® — la récupération passe d'abord par le sommeil" },
      { key: 'c', label: 'STREX® JOUR uniquement' },
      { key: 'd', label: 'EXTRA MAG® — parce que les sportifs dorment bien' },
    ],
    correctAnswers: ['a'],
    explanation: "Le sportif présente un besoin musculaire direct lié à l'effort physique intense et à la sudation, sans plainte de la sphère nerveuse ou de l'endormissement. Extra MAG® répond exactement à cette sollicitation musculaire.",
  },
  {
    id: 19,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 1,
    durationSeconds: 40,
    durationLabel: '40 s',
    question: "CAS 4 — Patient sortant d'une cure STREX®, sommeil rétabli, toujours sous pression.",
    options: [
      { key: 'a', label: "Arrêter toute supplémentation, l'objectif est atteint" },
      { key: 'b', label: 'EXTRA MAG® en relais — plus besoin de mélatonine, toujours besoin de magnésium' },
      { key: 'c', label: 'Renouveler STREX® indéfiniment' },
      { key: 'd', label: 'Alterner les deux une semaine sur deux' },
    ],
    correctAnswers: ['b'],
    explanation: "Une fois le rythme de sommeil rétabli, il n'y a plus d'indication à poursuivre la mélatonine au long cours. Le patient étant toujours soumis au stress et à la pression, le relais naturel pour maintenir ses réserves en magnésium est Extra MAG®.",
  },
  {
    id: 20,
    part: 'D',
    partTitle: 'Extra MAG® et STREX®',
    type: 'multiple',
    typeLabel: 'PLUSIEURS RÉPONSES',
    points: 3,
    durationSeconds: 60,
    durationLabel: '1 min',
    question: "Quelles phrases sont INTERDITES en visite ?",
    subInstruction: "Cochez les TROIS phrases proscrites.",
    requiredCount: 3,
    options: [
      { key: 'a', label: '« C\'est le nouveau STREX® »' },
      { key: 'b', label: '« C\'est mieux que STREX® »' },
      { key: 'c', label: '« Vous pouvez prendre les deux en même temps »' },
      { key: 'd', label: '« C\'est notre référence magnésium, à côté de STREX® »' },
      { key: 'e', label: '« Ce sont deux réponses à deux demandes différentes »' },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation: "Proscrire toute cannibalisation ou confusion : il est interdit de dire que c'est le « nouveau STREX® », que c'est « mieux que STREX® » ou de préconiser la prise simultanée non raisonnée. Ils doivent être présentés comme deux solutions complémentaires pour deux profils différents.",
  },

  // PARTIE E: MISE EN SITUATION
  {
    id: 21,
    part: 'E',
    partTitle: 'Mise en situation',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 3,
    durationSeconds: 70,
    durationLabel: "1'10",
    question: "Un pharmacien : « Votre teneur est plus faible que le marin que j'ai en rayon. »",
    subInstruction: "Quelle réponse est la bonne ?",
    options: [
      { key: 'a', label: '« C\'est vrai, mais notre prix est plus bas »' },
      { key: 'b', label: '« La teneur mesure ce que le patient avale, pas ce qu\'il absorbe. Une forte teneur mal absorbée sature l\'intestin. Extra MAG® apporte 125 mg de magnésium élément, soit 33,3 % de la VNR, sous forme chélatée. »' },
      { key: 'c', label: '« Notre teneur est en réalité plus élevée, c\'est une erreur d\'étiquetage »' },
      { key: 'd', label: '« La teneur n\'a aucune importance, seule compte la marque »' },
    ],
    correctAnswers: ['b'],
    explanation: "Argumentation scientifique magistrale : réorienter la discussion de la quantité brute ingérée vers l'absorption nette cellulaire. Une formule marine de 300 mg absorbée à moins de 10 % apporte moins de 30 mg réels et provoque des diarrhées, tandis qu'Extra MAG® apporte 125 mg de magnésium chélaté hautement biodisponible et toléré.",
  },
  {
    id: 22,
    part: 'E',
    partTitle: 'Mise en situation',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 3,
    durationSeconds: 70,
    durationLabel: "1'10",
    question: "Un médecin : « Le bisglycinate, aujourd'hui tout le monde en fait. »",
    subInstruction: "Quelle réponse est la bonne ?",
    options: [
      { key: 'a', label: '« C\'est vrai, c\'est devenu banal, mais nous sommes moins chers »' },
      { key: 'b', label: '« Beaucoup revendiquent la mention sans chélation réellement formée : ce sont des mélanges de sel et de glycine. Extra MAG® utilise l\'ALBION® TRAACS®, chélation contrôlée et certifiée, dont le logo figure sur la boîte. »' },
      { key: 'c', label: '« Nous sommes les seuls à faire du bisglycinate en Tunisie »' },
      { key: 'd', label: '« Le bisglycinate est dépassé, nous passons au marin »' },
    ],
    correctAnswers: ['b'],
    explanation: "Différenciation technologique : le marché comporte de nombreux « faux bisglycinates » (simples mélanges physiques d'oxyde de Mg et de glycine sans liaison covalente). Extra MAG® s'appuie sur la référence mondiale certifiée ALBION® TRAACS® garantissant une vraie chélation moléculaire brevetée.",
  },
  {
    id: 23,
    part: 'E',
    partTitle: 'Mise en situation',
    type: 'single',
    typeLabel: 'UNE SEULE RÉPONSE',
    points: 6,
    durationSeconds: 90,
    durationLabel: "1'30",
    question: "Quelle conclusion de visite respecte la règle de l'engagement ?",
    subInstruction: "Trois éléments sont attendus. Une seule proposition les réunit tous.",
    options: [
      { key: 'a', label: '« Docteur, je vous laisse la documentation, n\'hésitez pas si vous avez des questions. »' },
      { key: 'b', label: '« Docteur, essayez Extra MAG® chez vos patients fatigués, une gélule par jour pendant un mois. »' },
      { key: 'c', label: '« Docteur, sur vos trois prochains patients fatigués, une gélule par jour pendant un mois. Je repasse dans trois semaines recueillir votre retour. »' },
      { key: 'd', label: '« Docteur, je repasse le mois prochain et on fera le point sur Extra MAG®. »' },
    ],
    correctAnswers: ['c'],
    explanation: "Correction commentée clé (Q23) : La règle d'or de l'engagement commercial et médical comprend 3 piliers : 1° Une cible patient précise et quantifiée (« sur vos trois prochains patients fatigués »), 2° Une prescription claire avec posologie et durée (« une gélule par jour pendant un mois »), 3° Un engagement de revisite daté et motivé (« Je repasse dans trois semaines recueillir votre retour »).",
  },
];

export const TOTAL_QUESTIONS = 23;
export const TOTAL_POINTS = 50;

export function evaluateQuiz(answers: Record<number, { selectedOptions: string[] }>): {
  totalScore: number;
  questionResults: Record<number, { isCorrect: boolean; pointsEarned: number }>;
} {
  let totalScore = 0;
  const questionResults: Record<number, { isCorrect: boolean; pointsEarned: number }> = {};

  QUESTIONS.forEach((q) => {
    const userAns = answers[q.id]?.selectedOptions || [];
    const sortedUser = [...userAns].sort();
    const sortedCorrect = [...q.correctAnswers].sort();
    const isCorrect =
      sortedUser.length === sortedCorrect.length &&
      sortedUser.every((val, idx) => val === sortedCorrect[idx]);

    const pointsEarned = isCorrect ? q.points : 0;
    totalScore += pointsEarned;
    questionResults[q.id] = { isCorrect, pointsEarned };
  });

  return { totalScore, questionResults };
}

export function getStatusFromScore(score: number): {
  status: 'validated' | 'validated_with_support' | 'retake';
  label: string;
  colorClass: string;
  badgeBg: string;
  badgeBorder: string;
} {
  if (score >= 40) {
    return {
      status: 'validated',
      label: 'Validé',
      colorClass: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-500/40',
    };
  } else if (score >= 30) {
    return {
      status: 'validated_with_support',
      label: 'Validé avec accompagnement',
      colorClass: 'text-amber-400',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
    };
  } else {
    return {
      status: 'retake',
      label: 'Reprise',
      colorClass: 'text-rose-400',
      badgeBg: 'bg-rose-500/20',
      badgeBorder: 'border-rose-500/40',
    };
  }
}
