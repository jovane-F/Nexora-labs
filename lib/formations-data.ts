export interface ProgramMonth {
  month: string;
  title: string;
  points: string[];
}

export interface Pack {
  id: string;
  slug: string;
  name: string;
  stack: string[];
  lead: string;
  popular: boolean;
  duration: string;
  sessions: string;
  level: string;
  description: string;
  prerequisites: string[];
  program: ProgramMonth[];
}

export const packs: Pack[] = [
  {
    id: "01",
    slug: "web-starter",
    name: "Web Starter",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    lead: "Équipe",
    popular: false,
    duration: "3 Mois",
    sessions: "3 Sessions / Semaine",
    level: "Débutant",
    description:
      "Le parcours d'initiation au développement web de Nexora Labs : 12 semaines et 36 séances pour construire, styler et rendre interactives des pages web modernes et responsives, jusqu'à un projet final complet.",
    prerequisites: [
      "Aucun prérequis technique",
      "Un ordinateur portable",
      "De la motivation et de la rigueur",
    ],
    program: [
      {
        month: "Mois 1",
        title: "Fondations Web, HTML & CSS",
        points: [
          "Semaine 1 — Introduction au web et structuration sémantique en HTML",
          "Semaine 2 — HTML intermédiaire : tableaux, formulaires, inputs et validation",
          "Semaine 3 — CSS fondamentaux : sélecteurs, box model, positionnement",
          "Semaine 4 — CSS moderne : Flexbox, Grid et responsive mobile-first",
        ],
      },
      {
        month: "Mois 2",
        title: "JavaScript",
        points: [
          "Semaine 5 — Bases JS : variables, conditions et boucles",
          "Semaine 6 — Fonctions, tableaux, objets et méthodes (map, filter, find)",
          "Semaine 7 — DOM et gestion des événements (click, submit, input)",
          "Semaine 8 — Validation de formulaires, localStorage, fetch & JSON",
        ],
      },
      {
        month: "Mois 3",
        title: "Tailwind CSS & Projet final",
        points: [
          "Semaine 9-10 — Tailwind CSS : classes utilitaires, composants, responsive",
          "Semaine 11-12 — Conception et développement du projet final",
          "Projet recommandé : mini-plateforme vitrine \"Nexora Academy\"",
          "Semaine 12 — Tests, optimisation et soutenance finale",
        ],
      },
    ],
  },
  {
    id: "02",
    slug: "php-web",
    name: "PHP Web",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    lead: "Équipe",
    popular: false,
    duration: "3 Mois",
    sessions: "3 Sessions / Semaine",
    level: "Débutant à Intermédiaire",
    description:
      "Passez du site statique au site dynamique : back-office, formulaires connectés et base de données avec PHP.",
    prerequisites: [
      "Bases HTML / CSS (Pack Web Starter conseillé)",
      "Un ordinateur portable",
      "De la motivation et de la rigueur",
    ],
    program: [
      {
        month: "Mois 1",
        title: "Fondamentaux & PHP",
        points: ["Rappels HTML / CSS / JS", "Syntaxe PHP", "Formulaires côté serveur"],
      },
      {
        month: "Mois 2",
        title: "Dynamique & Données",
        points: ["PHP orienté objet", "Sessions & authentification", "Connexion à MySQL"],
      },
      {
        month: "Mois 3",
        title: "Projet final",
        points: ["Site dynamique avec back-office", "Opérations CRUD", "Mise en ligne du projet"],
      },
    ],
  },
  {
    id: "03",
    slug: "spring-boot",
    name: "Spring Boot",
    stack: ["Spring Boot", "Angular"],
    lead: "Boris",
    popular: true,
    duration: "3 Mois",
    sessions: "3 Sessions / Semaine",
    level: "Intermédiaire à Avancé",
    description:
      "Formation fullstack Java : 12 semaines et 36 séances pour concevoir une API REST robuste avec Spring Boot, construire une SPA avec Angular, puis les connecter, sécuriser et déployer sur un projet fil rouge complet.",
    prerequisites: [
      "Bases de la programmation (Java apprécié)",
      "Un ordinateur portable",
      "De la motivation et de la rigueur",
    ],
    program: [
      {
        month: "Mois 1",
        title: "Spring Boot & Architecture Backend (Java)",
        points: [
          "Semaine 1 — Écosystème Java/Spring, contrôleurs REST et annotations clés",
          "Semaine 2 — DTO, validation des données et gestion globale des exceptions",
          "Semaine 3 — Persistance avec Spring Data JPA (entités, JpaRepository)",
          "Semaine 4 — Relations entre entités et couche de services métier",
        ],
      },
      {
        month: "Mois 2",
        title: "Frontend Moderne avec Angular",
        points: [
          "Semaine 5 — TypeScript, Angular CLI, composants et data binding",
          "Semaine 6 — Directives, two-way binding et formulaires",
          "Semaine 7 — Routage, navigation et architecture modulaire",
          "Semaine 8 — Services, RxJS, HttpClient et formulaires réactifs",
        ],
      },
      {
        month: "Mois 3",
        title: "Intégration Fullstack, Sécurité & Projet fil rouge",
        points: [
          "Semaine 9 — Interconnexion Angular / Spring Boot et configuration CORS",
          "Semaine 10 — Sécurité Web : Spring Security et authentification JWT",
          "Semaine 11 — Développement guidé du projet fil rouge",
          "Semaine 12 — Finalisation, déploiement (Docker basique) et démo finale",
        ],
      },
    ],
  },
  {
    id: "04",
    slug: "nextjs-pro",
    name: "Next.js Pro",
    stack: ["Next.js", "React", "Tailwind CSS"],
    lead: "Équipe",
    popular: true,
    duration: "3 Mois",
    sessions: "3 Sessions / Semaine",
    level: "Intermédiaire à Avancé",
    description:
      "Parcours full-stack frontend de 12 semaines (36 séances, ≈9h/semaine) qui assemble React pour les interfaces, Tailwind CSS pour le design system et Next.js App Router pour livrer une application web complète, sécurisée et déployée.",
    prerequisites: [
      "Bases HTML / CSS / JavaScript",
      "Notions de React appréciées",
      "Un ordinateur portable",
    ],
    program: [
      {
        month: "Mois 1",
        title: "React & Tailwind CSS — Fondations UI",
        points: [
          "Semaine 1-2 — React : JSX/TSX, composants, props, hooks et formulaires contrôlés",
          "Semaine 3-4 — Tailwind CSS : utility-first, responsive et mini design system",
        ],
      },
      {
        month: "Mois 2",
        title: "Next.js — App Router & Données",
        points: [
          "Semaine 5 — App Router : routing, layouts et navigation",
          "Semaine 6 — Server/Client Components, data fetching et états UX (loading, error, Suspense)",
          "Semaine 7 — Server Actions, base de données et CRUD",
          "Semaine 8 — Route Handlers, authentification et rôles (RBAC)",
        ],
      },
      {
        month: "Mois 3",
        title: "Sécurité, Performance & Projet final",
        points: [
          "Semaine 9 — Sécurité : validation, contrôle d'accès, XSS/CSRF",
          "Semaine 10 — Performance & SEO : cache, Core Web Vitals",
          "Semaine 11 — Tests (unit/intégration/E2E) et CI/CD",
          "Semaine 12 — Projet final : refactoring, audit qualité et démo professionnelle",
        ],
      },
    ],
  },
  {
    id: "05",
    slug: "conception-projets",
    name: "Conception Projets",
    stack: ["Cahier des charges", "Merise / UML", "Figma"],
    lead: "Équipe",
    popular: true,
    duration: "3 Mois",
    sessions: "3 Sessions / Semaine",
    level: "Tous niveaux",
    description:
      "Apprenez à cadrer, modéliser et prototyper un projet avant même d'écrire une ligne de code.",
    prerequisites: [
      "Aucun prérequis technique",
      "Un esprit analytique",
      "Un ordinateur portable",
    ],
    program: [
      {
        month: "Mois 1",
        title: "Analyse du besoin",
        points: ["Recueil des besoins", "Rédaction d'un cahier des charges", "Spécifications fonctionnelles"],
      },
      {
        month: "Mois 2",
        title: "Modélisation",
        points: ["Merise / UML", "Architecture de bases de données", "Diagrammes de cas d'usage"],
      },
      {
        month: "Mois 3",
        title: "Prototypage & soutenance",
        points: ["Maquettage sur Figma", "Dossier de conception complet", "Présentation / soutenance du projet"],
      },
    ],
  },
];

export function getPackBySlug(slug: string): Pack | undefined {
  return packs.find((pack) => pack.slug === slug);
}