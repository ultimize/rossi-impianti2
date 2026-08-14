/**
 * Helper per la gestione delle date di pubblicazione.
 *
 * Problema risolto: `<input type="datetime-local">` lavora sempre nel fuso orario
 * locale del browser, mentre `Date.toISOString()` restituisce UTC. Usare
 * `toISOString().substring(0,16)` per popolare il campo faceva vedere l'ora
 * sbagliata (−1h in inverno, −2h in ora legale) e, ad ogni salvataggio,
 * spostava ulteriormente indietro la data dell'articolo.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/** Timestamp ISO/UTC -> valore per <input type="datetime-local"> in ora locale. */
export function toDatetimeLocalValue(value?: string | null): string {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** Valore di <input type="datetime-local"> (ora locale) -> timestamp ISO/UTC. */
export function fromDatetimeLocalValue(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value); // senza suffisso di fuso viene letto come ora locale
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Un articolo è "programmato" quando è marcato come pubblicato ma la sua data
 * di pubblicazione è nel futuro: resta nascosto dal sito finché non arriva.
 */
export function isScheduled(status?: string | null, publishedAt?: string | null): boolean {
  if (status !== 'published' || !publishedAt) return false;
  const t = new Date(publishedAt).getTime();
  return !Number.isNaN(t) && t > Date.now();
}

/** Etichetta di stato per l'area admin. */
export function statusLabel(status?: string | null, publishedAt?: string | null): 'pubblicato' | 'programmato' | 'bozza' {
  if (status !== 'published') return 'bozza';
  return isScheduled(status, publishedAt) ? 'programmato' : 'pubblicato';
}

/** Data + ora formattate in italiano (es. 14/08/2026, 09:30). */
export function formatDateTimeIt(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
