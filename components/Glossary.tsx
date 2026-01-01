
import React, { useState } from 'react';

const glossaryData = [
  {
    term: 'Taxonomia',
    definition: 'Classificazione usata in biologia per ordinare organismi viventi che condividono caratteristiche comuni e vengono classificati in un sistema gerarchico.',
  },
  {
    term: 'Macroinvertebrati',
    definition: 'Organismi invertebrati di dimensioni superiori al millimetro, quindi visibili a occhio nudo, che vivono a stretto contatto con i fondali degli ambienti acquatici.',
    image: 'https://files.catbox.moe/d9a1ba.jpg',
  },
  {
    term: 'IBE',
    definition: "L'indice Biotico Esteso è valore utilizzato per calcolare la salute dei fiumi. Si basa sull'analisi e presenza dei macroinvertebrati (piccoli animali senza scheletro come insetti, molluschi, crostacei) che vivono sul fondale dei corsi d'acqua. La presenza di determinati gruppi di organismi indica un'acqua più o meno pulita.",
  },
];

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


const GlossaryItem: React.FC<{ term: string; definition: string; image?: string; isOpen: boolean; onClick: () => void; }> = ({ term, definition, image, isOpen, onClick }) => {
    return (
        <div className="border border-slate-200/80 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300 group">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left p-4 md:p-5 bg-white group-hover:bg-slate-50 transition-colors active:bg-slate-100"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-slate-800">{term}</h3>
                <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-blue-100/50 scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out group-hover:animate-pulse"></div>
                    <ChevronIcon isOpen={isOpen} />
                </div>
            </button>
            <div
                className="grid transition-all duration-500 ease-in-out"
                style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                }}
            >
                <div className="overflow-hidden">
                    <div className="p-4 md:p-5 pt-0 text-slate-600 leading-relaxed bg-white">
                        <p>{definition}</p>
                        {image && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={image}
                                    alt={`Immagine di ${term}`}
                                    className="rounded-lg shadow-md max-w-full max-h-80 object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Glossary: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2 mb-6">
                Glossario
            </h2>
            <div className="space-y-4">
                {glossaryData.map((item, index) => (
                    <GlossaryItem
                        key={index}
                        term={item.term}
                        definition={item.definition}
                        image={item.image}
                        isOpen={openIndex === index}
                        onClick={() => handleItemClick(index)}
                    />
                ))}
            </div>
        </section>
    );
};
