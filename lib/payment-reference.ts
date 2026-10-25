import { randomBytes } from "crypto";

// Alphabet sans caractères ambigus (pas de 0/O, 1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Référence de paiement unique et lisible, ex. NX-7K2M9QPA (serveur uniquement). */
export function generateReference(): string {
  const bytes = randomBytes(8);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `NX-${code}`;
}