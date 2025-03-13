export type Role = "manager" | "admin" | "president";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  center_id: string | null;
};

export type Candidate = {
  id: string;
  nom: string;
  numero: number;
  partie: string;
  total_votes: boolean;
  id_centre: string;
  id_candidat: string;
  date_vote: string;
  a_vote: boolean;
  identifiant: string;
};

export const images = [
  {
    image: "/moise.jpg",
    partyLogo: "/parti_logo.png",
    numero: 3,
  },
  {
    image: "/felix.jpg",
    partyLogo: "/udps.png",
    numero: 20,
  },
  {
    image: "/martin.jpg",
    partyLogo: "/ecide.jpg",
    numero: 21,
  },
  {
    image: "/constant.jpg",
    partyLogo: "/dypro.jpeg",
    numero: 2,
  },
  {
    image: "/adolphe.jpg",
    partyLogo: "/palu.png",
    numero: 24,
  },
];
