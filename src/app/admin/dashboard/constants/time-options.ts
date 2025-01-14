// Options de durée disponibles pour la session
export const TIME_OPTIONS = [
  { value: "1min", label: "1 minute" },
  { value: "5min", label: "5 minutes" },
  { value: "10min", label: "10 minutes" },
  { value: "15min", label: "15 minutes" },
  { value: "24h", label: "24 heures" },
] as const;

// Durée par défaut sélectionnée
export const DEFAULT_DURATION = "5min";

// Type pour les valeurs de durée possibles
export type Duration = (typeof TIME_OPTIONS)[number]["value"];
