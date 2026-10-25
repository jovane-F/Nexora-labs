// Constantes et fonctions pures du paiement (utilisables côté serveur ET côté navigateur).

export const CURRENCY = "FCFA"; // à changer si besoin

export function formatAmount(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} ${CURRENCY}`;
}

export type PayMethod = "MOBILE_MONEY" | "BANK_TRANSFER" | "CARD";

// Modes de paiement proposés aux étudiants.
// CARD est volontairement absent : le paiement par carte exige un prestataire (passerelle) que le site n'a pas encore.
export const ENABLED_METHODS: PayMethod[] = ["MOBILE_MONEY", "BANK_TRANSFER"];

export const METHOD_LABELS: Record<PayMethod, string> = {
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Virement bancaire",
  CARD: "Carte bancaire",
};

// Coordonnées de réception de l'argent : À REMPLIR par l'équipe Nexora.
// Tant qu'une liste est vide, la page de paiement invite l'étudiant à attendre les coordonnées de l'équipe.
// Exemple : MOBILE_MONEY: ["Numéro : 6XX XX XX XX", "Nom du compte : Nexora Labs"]
export const PAYMENT_INSTRUCTIONS: Record<PayMethod, string[]> = {
  MOBILE_MONEY: [],
  BANK_TRANSFER: [],
  CARD: [],
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  FULL: "Paiement complet",
  INSTALLMENT_1: "1re tranche",
  INSTALLMENT_2: "2e tranche",
  SERVICE_DEPOSIT: "Acompte",
};

type PaymentLike = { status: string; type: string };

export type PaymentState = {
  /** initial : rien de payé · second : 1re tranche validée · done : tout est réglé */
  nextStep: "initial" | "second" | "done";
  hasPending: boolean;
  lastRejected: boolean;
};

export function computePaymentState(payments: PaymentLike[]): PaymentState {
  const paid = (type: string) => payments.some((p) => p.status === "SUCCESSFUL" && p.type === type);
  const hasPending = payments.some((p) => p.status === "PENDING");

  const nextStep: PaymentState["nextStep"] =
    paid("FULL") || paid("INSTALLMENT_2") ? "done" : paid("INSTALLMENT_1") ? "second" : "initial";

  const lastRejected = !hasPending && nextStep !== "done" && payments.some((p) => p.status === "FAILED");

  return { nextStep, hasPending, lastRejected };
}