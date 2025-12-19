
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './components/Modal';

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const App: React.FC = () => {
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState<{title: string, ideal: string, desc: string} | null>(null);
  const [isArpaModalOpen, setIsArpaModalOpen] = useState(false);
  const [isEfemerotteriModalOpen, setIsEfemerotteriModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  
  // Animation state for composition bars
  const [hasAnimatedBars, setHasAnimatedBars] = useState(false);
  const compositionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isResultsModalOpen) {
      const targetScore = 8.5;
      setScore(0); // Reset score to 0 before starting animation
      
      const timer = setTimeout(() => {
        let currentScore = 0;
        const interval = setInterval(() => {
          currentScore += 0.1;
          if (currentScore >= targetScore) {
            setScore(targetScore);
            clearInterval(interval);
          } else {
            setScore(parseFloat(currentScore.toFixed(1)));
          }
        }, 20);
      }, 300); // Delay to sync with modal opening animation

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isResultsModalOpen]);

  // Observer for composition bars animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimatedBars(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );

    if (compositionRef.current) {
      observer.observe(compositionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const fieldParameters = [
    {
      title: "Temperatura",
      value: "13,1°C",
      unit: "",
      ideal: "8–15 °C",
      desc: "Misura quanto è calda l’acqua; più è fredda, più può contenere ossigeno. Temperature basse favoriscono specie sensibili e buone condizioni ecologiche.",
      className: ""
    },
    {
      title: "Ossigeno (O₂)",
      value: "10,32",
      unit: "mg/L",
      ideal: "≥ 8 mg/L",
      desc: "Indica quanto ossigeno è disciolto nell’acqua. Livelli alti di questo indicatore sono essenziali per pesci e macroinvertebrati e indicano un buon stato biologico.",
      className: ""
    },
    {
      title: "Saturazione O₂",
      value: "98,2%",
      unit: "",
      ideal: "90–100%",
      desc: "Percentuale che indica quanta parte del massimo livello di ossigeno che può essere disciolto nel fiume è effettivamente contenuto. Una saturazione vicino al 100% indica un buon equilibrio biologico.",
      className: ""
    },
    {
      title: "pH",
      value: "8,12",
      unit: "",
      ideal: "6,5 – 8,5",
      desc: "Misura se l’acqua è acida o basica. Un pH quasi neutro è stabile e adatto alla maggior parte delle specie acquatiche.",
      className: ""
    },
    {
      title: "Conduttività",
      value: "367,0",
      unit: "μS/cm",
      ideal: "150–500 µS/cm",
      desc: "Indica la quantità di sali disciolti nell’acqua. Valori medi indicano un equilibrio naturale; valori molto alti suggeriscono possibile inquinamento.",
      className: "col-span-2 sm:col-span-1"
    }
  ];

  const macroinvertebratiDataRaw = [
    {
      group: "Plecotteri",
      items: [{ name: "Leuctra", count: 30 }]
    },
    {
      group: "Efemerotteri",
      items: [
        { name: "Baetis", count: 56 },
        { name: "Ecdyonurus", count: 10 },
        { name: "Habeoleatoides", count: 2 }
      ]
    },
    {
      group: "Tricotteri",
      items: [
        { name: "Hydropsydnidae", count: 12 },
        { name: "Sericostomatidae", count: 4 }
      ]
    },
    {
      group: "Coleotteri",
      items: [
        { name: "Elmidae", count: 3 },
        { name: "Scirtidae", count: 1 }
      ]
    },
    {
      group: "Crostacei",
      items: [{ name: "Gammaridae", count: 4 }]
    },
    {
      group: "Ditteri",
      items: [
        { name: "Chironomidae", count: 5 },
        { name: "Athericidae", count: 11 },
        { name: "Simulidae", count: 1 }
      ]
    },
    {
      group: "Idracari",
      items: [{ name: "Hydracarina", count: 4 }]
    }
  ];

  // Sorting by total count descending to fulfill "tabella di abbondanza macroinvertebrati deve essere in ordine di abbondanza"
  const macroinvertebratiData = [...macroinvertebratiDataRaw].sort((a, b) => {
    const totalA = a.items.reduce((acc, item) => acc + item.count, 0);
    const totalB = b.items.reduce((acc, item) => acc + item.count, 0);
    return totalB - totalA;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex items-center justify-center p-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <main className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8 md:p-12 transition-shadow hover:shadow-2xl duration-500 my-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 tracking-tight">
            Monitoraggio torrente Diebra
          </h1>
          <p className="text-slate-500 mt-2">Ricerca della classe 2^T - Liceo Scientifico Edoardo Amaldi</p>
        </header>

        <section className="space-y-6 text-lg text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-4">Obbiettivo</h2>
          <p>
            L'obbiettivo di questa attività era monitorare lo stato ecologico del torrente Diebra a Nese. Per farlo la classe si è recata al torrente e ha calcolato il suo{' '}
            <span className="relative group cursor-help">
              <span className="font-semibold text-blue-600 border-b-2 border-dotted border-blue-400">
                IBE
              </span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-base rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Un metodo scientifico per misurare la salute dei fiumi. Si basa sull'analisi della presenza e del tipo di macroinvertebrati (piccoli animali senza scheletro come insetti, molluschi, crostacei) che vivono sul fondale dei corsi d'acqua. La presenza di determinate specie indica un'acqua più o meno pulita.
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
              </span>
            </span>: un metodo scientifico per misurare la salute dei fiumi. Si basa sull'analisi della presenza e del tipo di macroinvertebrati (piccoli animali senza scheletro come insetti, molluschi, crostacei) che vivono sul fondale dei corsi d'acqua. La presenza di determinate specie indica un'acqua più o meno pulita.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-4">
            Posizione del Rilevamento
          </h2>
          <div className="mt-4 rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1826.5000973433305!2d9.710030014227408!3d45.74983298265743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDXCsDQ0JzU5LjQiTiA5wrA0Mic0My4zIkU!5e1!3m2!1sit!2sit!4v1761309097269!5m2!1sit!2sit"
              className="w-full h-96 md:h-[450px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa della posizione del torrente Diebra"
            ></iframe>
          </div>
        </section>
        
        <section className="mt-10 space-y-6 text-lg text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-4">Procedimento</h2>
          <p>
            Per osservare i parametri chimici del torrente la classe ha utilizzato una sonda multiparametrica che ha immerso nel torrente. I ragazzi si sono divisi in 5 gruppi, ognuno dei quali ha dovuto analizzare un tratto della Diebra.
          </p>
          <p>
            Per rilevare la presenza di{' '}
            <span className="relative group cursor-help">
              <span className="font-semibold text-blue-600 border-b-2 border-dotted border-blue-400">
                macroinvertebrati
              </span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-base rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Organismi invertebrati di dimensioni superiori al millimetro, quindi visibili a occhio nudo, che vivono a stretto contatto con i fondali degli environments acquatici.
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
              </span>
            </span>
            {' '}nel torrente, ogni gruppo ha raschiato cinque volte per gruppo il torrente, con uno strumento specifico chiamato surber che ha permesso di esaminare un’area di torrente pari a 0,1 m².
          </p>
          <p>
            Dopo hanno smosso i sassi per far scivolare i microrganismi all’interno di un cilindro posizionato sulla base del retino. Successivamente è stato utilizzato uno spazzolino per prelevare le{' '}
            <span className="relative group cursor-help">
              <span className="font-semibold text-blue-600 border-b-2 border-dotted border-blue-400">
                diatomee
              </span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-base rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <span className="block">
                  Classe di Alghe unicellulari che vivono in colonie bentoniche o planctoniche, sia in acque marine che dolci, sono uno degli indicatori più importanti per la qualità dell’acqua.
                </span>
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
              </span>
            </span>
            {' '}che poi sono state osservate al microscopio.
          </p>

          <p>
            In laboratorio hanno osservato i macroinvertebrati raccolti e hanno identificato la loro{' '}
            <span className="relative group cursor-help">
              <span className="font-semibold text-blue-600 border-b-2 border-dotted border-blue-400">
                taxonomia
              </span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-base rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Classificazione di organismi viventi che condividono caratteristiche comuni e vengono classificati in un sistema gerarchico.
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
              </span>
            </span>
            {' '}utilizzando delle chiavi dicotomiche, schede per il riconoscimento degli organismi.
          </p>
          
          <div className="mt-6 rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <img 
              src="https://files.catbox.moe/qp1ejo.png" 
              alt="Chiavi dicotomiche utilizzate in laboratorio" 
              className="w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-6">
                Materiali Utilizzati
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-slate-700">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100/80 rounded-xl shadow-sm border border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-800 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5v3.75h-7.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v10.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3" />
                    </svg>
                    <span className="font-semibold text-sm">Sonda</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100/80 rounded-xl shadow-sm border border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-800 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5h16.5V3.75H3.75z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v16.5m4.5-16.5v16.5M3.75 9.75h16.5m-16.5 4.5h16.5" />
                    </svg>
                    <span className="font-semibold text-sm">Surber</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100/80 rounded-xl shadow-sm border border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-800 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25l7.5-7.5m-7.5 0h9v-3h-9v3zM6 9.75V7.5m3 2.25V7.5m3 2.25V7.5" />
                    </svg>
                    <span className="font-semibold text-sm">Spazzolini</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100/80 rounded-xl shadow-sm border border-transparent text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-800 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 18.75V9.75a2.25 2.25 0 00-2.25-2.25h-2.5A2.25 2.25 0 008 9.75v9M8.25 9.75V8.25a1.5 1.5 0 011.5-1.5h.75a1.5 1.5 0 011.5 1.5v1.5m-3 0h3m-3.75 6h5.25m-5.25 0a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h0" />
                    </svg>
                    <span className="font-semibold text-sm">Guanti impermeabili</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100/80 rounded-xl shadow-sm border border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-blue-800 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v3.857a2.25 2.25 0 01-2.25 2.25h-5.5a2.25 2.25 0 01-2.25-2.25v-3.857M19 14.5L14.25 10M5 14.5L9.75 10" />
                    </svg>
                    <span className="font-semibold text-sm">Microscopi</span>
                </div>
            </div>
        </section>

        <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-6">
                Risultati
            </h2>
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Osservazioni Generali</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-100/80 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.456L12.75 18l1.177-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.177a3.375 3.375 0 002.456 2.456L20.25 18l-1.177.398a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                            <p className="font-medium text-slate-700 mt-2 text-sm">Acqua limpida e trasparente</p>
                        </div>
                        <div className="bg-slate-100/80 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="font-medium text-slate-700 mt-2 text-sm">Nessuna pioggia nei 7 giorni precedenti</p>
                        </div>
                        <div className="bg-slate-100/80 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 19.5L19.5 16.5m0 0V19.5m0-3h-3" />
                            </svg>
                            <p className="font-medium text-slate-700 mt-2 text-sm">Regime idrologico: Magra</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Parametri di Campo</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {fieldParameters.map((param, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedParam(param)}
                                className={`bg-blue-100/50 p-4 rounded-xl text-center border border-blue-200 cursor-pointer shadow-sm hover:bg-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95 ${param.className}`}
                            >
                                <span className="text-sm text-blue-800 font-semibold">{param.title}</span>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {param.value} {param.unit && <span className="text-base font-normal">{param.unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center italic">Clicca sui riquadri per scoprire il significato e i valori ideali</p>
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Composizione del Fondale</h3>
                    <div className="space-y-4 text-slate-700 text-sm sm:text-base mb-8" ref={compositionRef}>
                        <div className="flex items-center gap-4">
                            <span className="w-32 sm:w-44 shrink-0 font-medium text-right">Ghiaia</span>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all duration-[2500ms] ease-out" 
                                    style={{ width: hasAnimatedBars ? '50%' : '0%' }}
                                >
                                    50%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-32 sm:w-44 shrink-0 font-medium text-right">Pietre piccole</span>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all duration-[2500ms] ease-out" 
                                    style={{ width: hasAnimatedBars ? '20%' : '0%', transitionDelay: '100ms' }}
                                >
                                    20%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-32 sm:w-44 shrink-0 font-medium text-right">Pietre medie</span>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all duration-[2500ms] ease-out" 
                                    style={{ width: hasAnimatedBars ? '20%' : '0%', transitionDelay: '200ms' }}
                                >
                                    20%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-32 sm:w-44 shrink-0 font-medium text-right">Pietre e massi rocciosi</span>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full flex items-center justify-end px-2 text-white text-xs font-bold min-w-[4ch] transition-all duration-[2500ms] ease-out" 
                                    style={{ width: hasAnimatedBars ? '5%' : '0%', transitionDelay: '300ms' }}
                                >
                                    5%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-32 sm:w-44 shrink-0 font-medium text-right">Pietre grossolane</span>
                            <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full flex items-center justify-end px-2 text-white text-xs font-bold min-w-[4ch] transition-all duration-[2500ms] ease-out" 
                                    style={{ width: hasAnimatedBars ? '5%' : '0%', transitionDelay: '400ms' }}
                                >
                                    5%
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Abbondanza Macroinvertebrati</h3>
                    <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                          <tr>
                            <th scope="col" className="px-6 py-3">Ordine</th>
                            <th scope="col" className="px-6 py-3">Famiglia / Genere</th>
                            <th scope="col" className="px-6 py-3 text-right">N. Individui</th>
                          </tr>
                        </thead>
                        <tbody>
                          {macroinvertebratiData.map((group, gIdx) => {
                            const isExpanded = !!expandedGroups[gIdx];
                            const totalCount = group.items.reduce((acc, item) => acc + item.count, 0);
                            
                            return (
                              <React.Fragment key={gIdx}>
                                <tr 
                                    onClick={() => toggleGroup(gIdx)}
                                    className={`border-b transition-colors cursor-pointer select-none ${isExpanded ? 'bg-blue-50 border-blue-100' : 'bg-white hover:bg-slate-50'}`}
                                >
                                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                    {group.group}
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 text-xs italic">
                                     {isExpanded ? '' : `${group.items.length} famiglie/generi`}
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-blue-700">
                                    {totalCount}
                                  </td>
                                </tr>
                                
                                {isExpanded && group.items.map((item, iIdx) => (
                                  <tr key={`${gIdx}-${iIdx}`} className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-100/80 transition-colors animate-fade-in-scale origin-top">
                                    <td className="px-6 py-3"></td>
                                    <td className="px-6 py-3 pl-8 border-l-2 border-blue-200 text-slate-700">
                                      {item.name}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-600">
                                      {item.count}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Sentence added as requested under the table */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-slate-700 italic text-base flex-1">
                        Come possiamo notare l'ordine dei macroinvertebrati nettamente più presenti nel torrente è quello degli efemerotteri
                      </p>
                      <button
                        onClick={() => setIsEfemerotteriModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm shrink-0"
                      >
                        Scopri di più sugli efemerotteri
                      </button>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 mb-4 mt-8">Tabella per il calcolo dell'IBE</h3>
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-slate-200">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                          <tr>
                            <th scope="col" className="px-6 py-3 border-r border-blue-500">Gruppo Faunistico</th>
                            <th scope="col" className="px-6 py-3 text-center border-r border-blue-500" colSpan={2}>Numero Totale Unità Sistematiche</th>
                          </tr>
                          <tr className="bg-blue-700">
                             <th scope="col" className="px-6 py-2"></th>
                             <th scope="col" className="px-6 py-2 text-center border-r border-blue-600">6 – 10</th>
                             <th scope="col" className="px-6 py-2 text-center">11 – 15</th>
                          </tr>
                        </thead>
                        <tbody>
                           <tr className="bg-white border-b hover:bg-slate-50">
                             <td className="px-6 py-4 font-bold text-slate-800">Plecotteri</td>
                             <td className="px-6 py-4 text-center font-medium">8</td>
                             <td className="px-6 py-4 text-center font-medium">9</td>
                           </tr>
                           <tr className="bg-blue-50/60 border-b border-blue-200 relative">
                             <td className="px-6 py-4 font-bold text-blue-800 relative">
                                Efemerotteri
                                <svg className="absolute hidden sm:block right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 translate-x-1/2 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                             </td>
                             <td className="px-6 py-4 text-center font-medium opacity-50">7</td>
                             <td className="px-6 py-4 text-center font-medium relative bg-blue-100/50">
                                <div className="relative inline-flex flex-col items-center justify-center">
                                     <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-4 border-red-500 bg-white shadow-lg transform scale-110">
                                        <span className="text-xl font-extrabold text-red-600">8</span>
                                     </div>
                                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-red-200">
                                        RISULTATO FINALE
                                     </div>
                                </div>
                             </td>
                           </tr>
                           <tr className="bg-white border-b hover:bg-slate-50">
                             <td className="px-6 py-4 font-bold text-slate-800">Tricotteri</td>
                             <td className="px-6 py-4 text-center font-medium">7</td>
                             <td className="px-6 py-4 text-center font-medium">7</td>
                           </tr>
                           <tr className="bg-slate-50 border-b hover:bg-slate-100">
                             <td className="px-6 py-4 font-bold text-slate-800">Gammaridi</td>
                             <td className="px-6 py-4 text-center font-medium">5</td>
                             <td className="px-6 py-4 text-center font-medium">6</td>
                           </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </section>

        <section className="mt-10 text-lg text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-4">
            Conclusioni
          </h2>
          <p>
            Dopo aver esaminato la tabella a doppia entrata la classe ha stabilito lo stato del ruscello Diebra. Visto che il range dei dati è tra 8 e 9 lo stato del torrente è buono.
          </p>

          <div className="overflow-x-auto my-8 rounded-xl shadow-lg border border-slate-200 no-scrollbar">
            <table className="w-full text-left border-collapse bg-white min-w-[700px]">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Classe di qualità</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Valore di I.B.E.</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Giudizio di qualità</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Colore relativo alla classe di qualità</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium">Classe I</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">10–11–12–…</td>
                  <td className="px-6 py-4">Ambiente non alterato in modo sensibile</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="inline-block w-6 h-6 rounded-md border border-black/10 shadow-sm bg-sky-400"></span>
                    <span className="font-medium text-sky-900">Azzurro</span>
                  </td>
                </tr>
                <tr className="bg-white ring-2 ring-blue-600 relative z-10 shadow-lg transform scale-[1.01] transition-transform">
                  <td className="px-6 py-4 font-bold text-green-900 relative">
                    Classe II
                    <span className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold tracking-wide">
                        IL NOSTRO TORRENTE
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-extrabold text-green-900">8–9</td>
                  <td className="px-6 py-4 font-semibold text-green-900">Ambiente con moderati sintomi di alterazione</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="inline-block w-6 h-6 rounded-md border border-black/10 shadow-sm bg-green-500"></span>
                    <span className="font-bold text-green-800">Verde</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium">Classe III</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">6–7</td>
                  <td className="px-6 py-4">Ambiente alterato</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="inline-block w-6 h-6 rounded-md border border-black/10 shadow-sm bg-yellow-400"></span>
                    <span className="font-medium text-yellow-900">Giallo</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium">Classe IV</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">4–5</td>
                  <td className="px-6 py-4">Ambiente molto alterato</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="inline-block w-6 h-6 rounded-md border border-black/10 shadow-sm bg-orange-400"></span>
                    <span className="font-medium text-orange-900">Arancione</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium">Classe V</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">0–1–2–3</td>
                  <td className="px-6 py-4">Ambiente fortemente degradato</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="inline-block w-6 h-6 rounded-md border border-black/10 shadow-sm bg-red-500"></span>
                    <span className="font-medium text-red-900">Rosso</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 pt-8 border-t border-slate-200 text-center">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Ringraziamenti</h3>
            <p className="text-slate-700 text-lg">
                Ringraziamo l'esperta che ci ha aiutato in questa attività: Silvia Cerea, dell'<b>Agenzia Regionale</b>{' '}
                <button
                    onClick={() => setIsArpaModalOpen(true)}
                    className="text-blue-600 font-semibold hover:text-blue-800 hover:underline focus:outline-none transition-colors"
                >
                    Arpa Lombardia
                </button>.
            </p>
        </section>

      </main>

      <Modal 
        isOpen={isResultsModalOpen} 
        onClose={() => setIsResultsModalOpen(false)} 
        title="Risultato della Rilevazione"
      >
        <div className="text-center p-2">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Indice di Qualità dell'Acqua (IBE)</h3>
            <p className="text-sm text-slate-500 mb-6">Il punteggio indica lo stato di salute del torrente su una scala da 0 a 10.</p>
            <div className="relative w-full bg-slate-200 rounded-full h-8 mb-2 shadow-inner">
                <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-8 rounded-full transition-all duration-[2000ms] ease-out flex items-center justify-center text-white font-bold"
                    style={{ width: `${(score / 10) * 100}%` }}
                >
                  <span className="transition-opacity duration-500" style={{opacity: score > 1 ? 1 : 0}}>
                    {score.toFixed(1)}
                  </span>
                </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 px-1 font-medium">
                <span>Pessimo</span>
                <span>Sufficiente</span>
                <span>Eccellente</span>
            </div>
            <div className="mt-8 bg-blue-50/70 p-4 rounded-xl">
                <p className="text-2xl font-bold text-blue-800">Stato: BUONO</p>
                <p className="text-slate-600 mt-1">L'ecosistema acquatico è in buone condizioni e ben equilibrato.</p>
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedParam}
        onClose={() => setSelectedParam(null)}
        title={selectedParam?.title}
      >
        {selectedParam && (
            <div className="space-y-5">
                <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Valore Ideale</p>
                    <p className="text-xl font-bold text-blue-900">{selectedParam.ideal}</p>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Significato</h4>
                    <p className="text-slate-700 leading-relaxed text-lg">
                        {selectedParam.desc}
                    </p>
                </div>
            </div>
        )}
      </Modal>

      <Modal
        isOpen={isArpaModalOpen}
        onClose={() => setIsArpaModalOpen(false)}
        title={
            <a 
                href="https://www.arpalombardia.it/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors flex items-center gap-2 group"
                title="Visita il sito ufficiale"
            >
                Arpa Lombardia
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a>
        }
      >
        <div className="space-y-4">
            <div className="text-left">
                <p className="text-slate-700 text-lg leading-relaxed">
                    L'<strong>Agenzia Regionale per la Protezione dell'Ambiente (ARPA)</strong> è un ente tecnico che si occupa della prevenzione e della protezione dell'ambiente in Lombardia.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed mt-4">
                    Il suo compito principale è monitorare costantemente la qualità di acqua, aria e suolo per garantire la salute degli ecosistemi e dei cittadini, oltre a fornire supporto tecnico-scientifico alle amministrazioni pubbliche.
                </p>
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEfemerotteriModalOpen}
        onClose={() => setIsEfemerotteriModalOpen(false)}
        title="Gli Efemerotteri"
      >
        <div className="space-y-4">
            <p className="text-slate-700 text-lg leading-relaxed">
              Gli efemerotteri sono insetti acquatici con metamorfosi incompleta: le larve vivono in acqua dolce, mentre gli adulti hanno vita molto breve e servono solo alla riproduzione.
            </p>
            <div className="rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://www.biopills.net/wp-content/uploads/2020/02/odonata-e1582565642413.jpg" 
                alt="Immagine efemerottero" 
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
