import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Rossi Impianti srl',
  description: 'Informativa sui cookie utilizzati sul sito di Rossi Impianti srl.',
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-bg text-text py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="font-saira font-extrabold text-4xl md:text-5xl uppercase tracking-[-0.5px] mb-8 text-text">
          Cookie Policy
        </h1>
        <div className="prose-custom">
          <p>
            Questo sito web utilizza i cookie. I cookie sono piccoli file di testo che possono essere utilizzati dai siti web per
            rendere più efficiente l'esperienza per l'utente e per fornire informazioni al proprietario del sito.
          </p>
          <p>
            Conformemente alle linee guida del Garante della Privacy e al Regolamento Generale sulla Protezione dei Dati (GDPR),
            puoi scegliere quali cookie autorizzare. I cookie necessari sono attivi di default, mentre per tutti gli altri
            puoi prestare o revocare il tuo consenso in qualsiasi momento.
          </p>
          <h2>1. Cosa sono i cookie?</h2>
          <p>
            Un cookie è un piccolo file di testo che un sito web salva sul tuo computer o dispositivo mobile quando visiti il sito.
            Permette al sito web di ricordare le tue azioni e preferenze (come login, lingua, dimensione dei caratteri e altre preferenze di visualizzazione)
            per un periodo di tempo, in modo che tu non debba reinserirle ogni volta che torni sul sito o navighi da una pagina all'altra.
          </p>
          <h2>2. Tipi di cookie utilizzati</h2>
          <h3>Cookie Necessari</h3>
          <p>
            I cookie necessari aiutano a contribuire a rendere fruibile un sito web abilitando le funzioni di base come la navigazione della pagina e l'accesso alle aree protette del sito. Il sito web non può funzionare correttamente senza questi cookie.
          </p>
          <h3>Cookie Statistici / Analitici</h3>
          <p>
            I cookie statistici aiutano i proprietari del sito web a capire come i visitatori interagiscono con i siti raccogliendo e trasmettendo informazioni in forma anonima.
          </p>
          <h3>Cookie di Marketing e Profilazione</h3>
          <p>
            I cookie di marketing vengono utilizzati per tracciare i visitatori attraverso i siti web. L'intento è quello di visualizzare annunci pertinenti e coinvolgenti per il singolo utente.
          </p>
          <h2>3. Gestione del Consenso</h2>
          <p>
            Puoi modificare o revocare il tuo consenso in qualsiasi momento cliccando sul link <strong>"Gestione cookie"</strong> presente nel footer di ogni pagina, oppure cancellando i cookie direttamente dalle impostazioni del tuo browser.
          </p>
        </div>
      </div>
    </div>
  );
}
