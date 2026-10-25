// Règles des classes : une classe = une session (academy_sessions) d'un pack, limitée à 5 étudiants.

export const CLASS_MAX_STUDENTS = 5;

/** Id de la première classe qui a encore de la place, ou null si toutes sont pleines. */
export function firstWithRoom(
  classes: { id: number; count: number }[],
  max: number = CLASS_MAX_STUDENTS
): number | null {
  const found = classes.find((c) => c.count < max);
  return found ? found.id : null;
}

/** Titre d'une classe créée automatiquement : « Classe 2 — Web Starter ». */
export function classTitle(position: number, packTitle: string): string {
  return `Classe ${position} — ${packTitle}`;
}