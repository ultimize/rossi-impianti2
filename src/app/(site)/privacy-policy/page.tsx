import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rossi Impianti srl',
  description: 'Informativa sulla privacy e sul trattamento dei dati personali degli utenti del sito di Rossi Impianti srl.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-bg text-text1 py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="font-saira font-extrabold text-4xl md:text-5xl uppercase tracking-[-0.5px] mb-8 text-white">
          Privacy Policy
        </h1>
        <div className="prose-dark">
          <p>
            Benvenuto nella nostra Privacy Policy. In questa pagina descriviamo le modalità di gestione del sito
            in riferimento al trattamento dei dati personali degli utenti che lo consultano.
          </p>
          <p>
            Si tratta di un'informativa resa ai sensi del Regolamento Generale sulla Protezione dei Dati (GDPR - Regolamento UE 2016/679)
            per coloro che interagiscono con i servizi web di Rossi Impianti S.r.l.
          </p>
          <h2>1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è:
            <br />
            <strong>Rossi Impianti S.r.l.</strong>
            <br />
            Via Dei Fiori, 9/A
            <br />
            36040 Sarego (VI)
            <br />
            Email: info@rossimpiantisrl.it
          </p>
          <h2>2. Tipi di Dati Trattati</h2>
          <h3>Dati di Navigazione</h3>
          <p>
            I sistemi informatici e le procedure software preposte al funzionamento di questo sito web acquisiscono,
            nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei
            protocolli di comunicazione di Internet (es. indirizzi IP, nomi a dominio dei computer utilizzati dagli utenti).
          </p>
          <h3>Dati forniti volontariamente dall'utente</h3>
          <p>
            L'invio facoltativo, esplicito e volontario di posta elettronica agli indirizzi indicati su questo sito
            comporta la successiva acquisizione dell'indirizzo del mittente, necessario per rispondere alle richieste,
            nonché degli eventuali altri dati personali inseriti nella missiva.
          </p>
          <h2>3. Diritti degli Interessati</h2>
          <p>
            I soggetti cui si riferiscono i dati personali hanno il diritto in qualunque momento di ottenere la conferma
            dell'esistenza o meno dei medesimi dati e di conoscerne il contenuto e l'origine, verificarne l'esattezza o
            chiederne l'integrazione o l'aggiornamento, oppure la rettificazione (artt. 15 e successivi del GDPR).
          </p>
        </div>
      </div>
    </div>
  );
}
