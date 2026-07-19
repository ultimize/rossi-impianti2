// Dati delle pagine di dettaglio Servizi (con galleria).
// Le immagini sono in /public/assets/servizi/<slug>/<slug>-N.jpg

export type Servizio = {
  slug: string;
  /** Cartella/prefisso dei file foto se diverso dallo slug (default: slug). */
  dir?: string;
  name: string;
  eyebrow: string;
  accent: 'rosso' | 'azzurro';
  intro: string[]; // paragrafi
  tags: string[];
  galleryCount: number;
  metaTitle: string;
  metaDescription: string;
};

import { media } from './media';

const gallery = (dir: string, n: number) =>
  Array.from({ length: n }, (_, i) => media(`servizi/${dir}/${dir}-${i + 1}.jpg`));

export const SERVIZI: Servizio[] = [
  {
    slug: 'impianti-industriali',
    dir: 'industriale',
    name: 'Impianti industriali',
    eyebrow: 'Il nostro core',
    accent: 'rosso',
    intro: [
      'Progettiamo e costruiamo impianti industriali chiavi in mano per aziende, capannoni e imprese edili: aria, acqua, gas e metano. Dal progetto esecutivo alla messa in opera, un unico interlocutore per l’intero cantiere.',
      'Seguiamo ogni fase con tecnici specializzati, garantendo soluzioni affidabili, a norma e dimensionate sulle reali esigenze produttive dell’azienda.',
    ],
    tags: ['Aria', 'Acqua', 'Gas / Metano', 'Chiavi in mano'],
    galleryCount: 33,
    metaTitle: 'Impianti industriali a Vicenza | Rossi Impianti',
    metaDescription:
      'Progettazione e costruzione di impianti industriali chiavi in mano a Vicenza: aria, acqua, gas e metano per aziende e capannoni. Dal 1980.',
  },
  {
    slug: 'impianti-antincendio',
    dir: 'antincendio',
    name: 'Impianti antincendio',
    eyebrow: 'Sicurezza',
    accent: 'rosso',
    intro: [
      'Progettiamo e realizziamo impianti antincendio per aziende e capannoni, a norma e certificati secondo le normative vigenti (UNI EN 12845). Dall’analisi del rischio alla manutenzione periodica.',
      'Sistemi sprinkler, reti di idranti e rilevazione dimensionati sul rischio specifico di ogni attività, per la massima sicurezza di persone e beni.',
    ],
    tags: ['A norma', 'Certificati', 'Sprinkler', 'Per aziende'],
    galleryCount: 3,
    metaTitle: 'Impianti antincendio a Vicenza | Rossi Impianti',
    metaDescription:
      'Progettazione e realizzazione di impianti antincendio certificati a Vicenza: sistemi sprinkler, idranti e rilevazione a norma UNI EN 12845.',
  },
  {
    slug: 'riscaldamento',
    name: 'Riscaldamento',
    eyebrow: 'Comfort',
    accent: 'azzurro',
    intro: [
      'Dopo un attento sopralluogo, Rossi Impianti progetta e installa impianti di riscaldamento per la casa, l’ufficio e l’azienda. L’obiettivo dei nostri idraulici specializzati è creare un ambiente che assicuri comfort climatico, impiegando le tecnologie più moderne per l’ottimizzazione dei consumi, in ottica green.',
      'Siamo specializzati nella posa e nella manutenzione di impianti a pannelli radianti a pavimento, soffitto e parete: la soluzione ideale per stanze confortevoli, senza sbalzi di temperatura grazie al calore che si diffonde uniformemente.',
    ],
    tags: ['Caldaie a condensazione', 'Pompe di calore', 'Pannelli radianti', 'Solare termico'],
    galleryCount: 13,
    metaTitle: 'Impianti di riscaldamento a Vicenza | Rossi Impianti',
    metaDescription:
      'Progettazione e installazione di impianti di riscaldamento a Vicenza: caldaie a condensazione, pompe di calore e pannelli radianti a pavimento, soffitto e parete.',
  },
  {
    slug: 'idraulica',
    name: 'Idraulica',
    eyebrow: 'Idrosanitario',
    accent: 'azzurro',
    intro: [
      'Realizziamo impianti idrosanitari, reti idriche, bagni e opere idrauliche per abitazioni, uffici e attività. Installazione, ristrutturazione e manutenzione a regola d’arte, con materiali di qualità.',
      'Dai piccoli interventi alle reti complete, garantiamo affidabilità e pulizia del lavoro, con l’assistenza di idraulici specializzati.',
    ],
    tags: ['Impianti sanitari', 'Reti idriche', 'Bagni', 'Manutenzione'],
    galleryCount: 8,
    metaTitle: 'Impianti idraulici a Vicenza | Rossi Impianti',
    metaDescription:
      'Impianti idrosanitari, reti idriche e opere idrauliche a Vicenza: installazione, ristrutturazione e manutenzione a regola d’arte. Dal 1980.',
  },
  {
    slug: 'climatizzazione',
    name: 'Climatizzazione',
    eyebrow: 'Clima',
    accent: 'azzurro',
    intro: [
      'Rossi Impianti, azienda idraulica vicentina certificata F-GAS, garantisce la gestione sicura e professionale dei gas fluorurati e propone la fornitura e l’installazione di impianti di climatizzazione per il perfetto comfort a casa, in ufficio o in negozio.',
      'Ci affidiamo ai grandi marchi internazionali che utilizzano gas ecologici e assicurano alte performance, con servizi di condizionamento, raffrescamento e ventilazione meccanica controllata per il ricircolo e la purificazione dell’aria indoor.',
    ],
    tags: ['Certificati F-GAS', 'Condizionamento', 'Raffrescamento', 'VMC'],
    galleryCount: 5,
    metaTitle: 'Impianti di climatizzazione a Vicenza | Rossi Impianti',
    metaDescription:
      'Fornitura e installazione di impianti di climatizzazione a Vicenza: condizionamento, raffrescamento e ventilazione meccanica controllata. Azienda certificata F-GAS.',
  },
];

export function getServizio(slug: string): Servizio | undefined {
  return SERVIZI.find((s) => s.slug === slug);
}

export function servizioGallery(s: Servizio): string[] {
  return gallery(s.dir ?? s.slug, s.galleryCount);
}

export function servizioHero(s: Servizio): string {
  const d = s.dir ?? s.slug;
  return media(`servizi/${d}/${d}-1.jpg`);
}
