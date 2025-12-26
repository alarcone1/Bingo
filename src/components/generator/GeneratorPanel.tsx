import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Play, RefreshCw, X, Printer, Settings2, ImageDown, Table, ClipboardCopy } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { BingoCard, generateBatch, generateBingoCard } from '../../utils/generator';
import { BingoCardPreview } from './BingoCardPreview';
import { GlassCard } from '../ui/GlassCard';
import { ActionButton } from '../ui/ActionButton';

interface Props {
    darkMode: boolean;
    onClose: () => void;
    // Lifted State Props
    cards: BingoCard[];
    setCards: (cards: BingoCard[]) => void;
    count: number;
    setCount: (n: number) => void;
    startId: number;
    setStartId: (n: number) => void;
}

export const GeneratorPanel: React.FC<Props> = ({
    darkMode,
    onClose,
    cards,
    setCards,
    count,
    setCount,
    startId,
    setStartId
}) => {
    // Local state needed only for targetId and loading states
    const [targetId, setTargetId] = useState<number>(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Tiny timeout to let UI show loading state
        setTimeout(() => {
            const newCards = generateBatch(count, startId);
            setCards(newCards);
            setIsGenerating(false);
        }, 100);
    };

    const handleDownloadPDF = () => {
        if (cards.length === 0) return;

        const doc = new jsPDF();
        const cardsPerPage = 4;

        // Title
        doc.setFontSize(22);
        doc.text("Bingo ELY - Cartones Oficiales", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Serie: ${startId} - ${startId + count - 1} | Total: ${count}`, 105, 30, { align: "center" });

        let xPos = 15;
        let yPos = 40;
        const cardWidth = 85;
        const cardHeight = 100; // Approx height including title
        const xGap = 10;
        const yGap = 10;

        cards.forEach((card, index) => {
            // Check page break
            if (index > 0 && index % cardsPerPage === 0) {
                doc.addPage();
                yPos = 20; // Reset Y for new page
            }

            // Calculate position (2x2 Grid)
            const positionInPage = index % cardsPerPage;
            const col = positionInPage % 2; // 0 or 1
            const row = Math.floor(positionInPage / 2); // 0 or 1

            const currentX = 15 + (col * (cardWidth + xGap));
            const currentY = yPos + (row * (cardHeight + yGap));

            // Draw Card Container Border
            doc.setDrawColor(200);
            doc.roundedRect(currentX, currentY, cardWidth, cardHeight - 5, 3, 3, 'S');

            // Card Header (ID)
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`Cartón #${card.id}`, currentX + (cardWidth / 2), currentY + 10, { align: "center" });

            // Table Data
            const tableBody = [
                [card.b[0], card.i[0], card.n[0], card.g[0], card.o[0]],
                [card.b[1], card.i[1], card.n[1], card.g[1], card.o[1]],
                [card.b[2], card.i[2], 'ID', card.g[2], card.o[2]], // Center is ID
                [card.b[3], card.i[3], card.n[2], card.g[3], card.o[3]],
                [card.b[4], card.i[4], card.n[3], card.g[4], card.o[4]],
            ];

            // Draw Table with autoTable
            autoTable(doc, {
                head: [['B', 'I', 'N', 'G', 'O']],
                body: tableBody,
                startY: currentY + 15,
                margin: { left: currentX + 5 },
                tableWidth: cardWidth - 10,
                theme: 'grid',
                headStyles: {
                    fillColor: [244, 63, 94], // Rose-500
                    halign: 'center',
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    halign: 'center',
                    textColor: 50
                },
                styles: {
                    fontSize: 12,
                    cellPadding: 3,
                },
                // Custom styling for the center cell
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 2 && data.row.index === 2) {
                        data.cell.text = [String(card.id)];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.textColor = [217, 119, 6]; // Amber-600
                    }
                }
            });
        });

        doc.save(`Bingo_ELY_Cartones_${startId}_${startId + count - 1}.pdf`);
    };

    const handleDownloadSinglePNG = async () => {
        if (isDownloadingSingle) return;
        setIsDownloadingSingle(true);

        try {
            const node = document.getElementById('single-card-capture-target');
            if (!node) throw new Error("Capture node not found");

            // Forced Wait to ensure DOM update
            await new Promise(resolve => setTimeout(resolve, 50));

            const blob = await toBlob(node, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 3, // High resolution export
                skipAutoScale: true
            });

            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Bingo_ELY_Carton_${targetId}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Single card download failed", error);
        } finally {
            setIsDownloadingSingle(false);
        }
    };

    const handleCopyToClipboard = async () => {
        if (isCopying || isDownloadingSingle) return;
        setIsCopying(true);

        try {
            const node = document.getElementById('single-card-capture-target');
            if (!node) throw new Error("Capture node not found");

            // Forced Wait to ensure DOM update
            await new Promise(resolve => setTimeout(resolve, 50));

            const blob = await toBlob(node, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 3,
                skipAutoScale: true
            });

            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ]);

                // Keep "Copiado" state for a moment
                setTimeout(() => setIsCopying(false), 2000);
            } else {
                setIsCopying(false);
            }
        } catch (error) {
            console.error("Clipboard copy failed", error);
            setIsCopying(false);
        }
    };

    // Find existing card in batch to ensure consistency, otherwise generate temporary
    const singleCard = cards.find(c => c.id === targetId) || generateBingoCard(targetId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">

            {/* Hidden Capture Target - Functionally visible but visually hidden off-screen */}
            <div className="fixed top-0 left-[-9999px] w-[320px] bg-white opacity-0 pointer-events-none">
                {/* Force Remount on ID change to ensure clean state */}
                <div id="single-card-capture-target" key={singleCard.id} className="w-full bg-white p-8 rounded-none">
                    <BingoCardPreview card={singleCard} darkMode={false} />
                </div>
            </div>

            <div className={`
        w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col
        ${darkMode ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-slate-200'}
      `}>
                {/* HEADER */}
                <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}
        `}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                            <Table size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-xl uppercase tracking-widest bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm">
                                GENERADOR DE CARTONES
                            </h2>
                            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Crea combinaciones únicas listas para imprimir
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* SIDEBAR: CONTROLS */}
                    <div className={`
            w-full md:w-80 p-6 flex flex-col gap-6 border-r
            ${darkMode ? 'border-white/10 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}
          `}>
                        {/* Input Group */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Cantidad de Cartones
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5000"
                                    value={count}
                                    onChange={(e) => setCount(Number(e.target.value))}
                                    className={`
                    w-full px-4 py-3 rounded-xl border font-mono text-lg outline-none focus:ring-2
                    ${darkMode
                                            ? 'bg-slate-950 border-slate-700 text-white focus:ring-rose-500/50'
                                            : 'bg-white border-slate-200 text-slate-900 focus:ring-rose-500/30'}
                  `}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    ID Inicial
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={startId}
                                    onChange={(e) => setStartId(Number(e.target.value))}
                                    className={`
                    w-full px-4 py-3 rounded-xl border font-mono text-lg outline-none focus:ring-2
                    ${darkMode
                                            ? 'bg-slate-950 border-slate-700 text-white focus:ring-rose-500/50'
                                            : 'bg-white border-slate-200 text-slate-900 focus:ring-rose-500/30'}
                  `}
                                />
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10" />

                        {/* Actions */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <ActionButton
                                onClick={handleGenerate}
                                label={isGenerating ? "Generando..." : (cards.length > 0 ? "Cartones Generados" : "Generar Cartones")}
                                icon={isGenerating ? <RefreshCw className="animate-spin" /> : <Settings2 />}
                                variant="primary"
                                disabled={isGenerating || cards.length > 0}
                            />

                            <button
                                onClick={handleDownloadPDF}
                                disabled={cards.length === 0}
                                className={`
                  flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold transition-all
                  ${cards.length === 0
                                        ? 'opacity-50 cursor-not-allowed bg-slate-500/10 text-slate-500'
                                        : darkMode
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'}
                `}
                            >
                                <Download size={20} />
                                <span>Descargar PDF</span>
                            </button>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10 my-2" />

                        {/* Single Download Section - Redesigned */}
                        <div className="flex flex-col gap-3">
                            <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Descarga Individual
                            </label>

                            <div className="flex flex-col gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={targetId}
                                    onChange={(e) => setTargetId(Number(e.target.value))}
                                    className={`
                            w-full px-4 py-3 rounded-xl border font-mono text-lg font-bold outline-none focus:ring-2 text-center mb-2
                            ${darkMode
                                            ? 'bg-slate-950 border-slate-700 text-white focus:ring-rose-500/50'
                                            : 'bg-white border-slate-200 text-slate-900 focus:ring-rose-500/30'}
                        `}
                                    placeholder="ID"
                                />

                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={handleCopyToClipboard}
                                        disabled={cards.length === 0 || isDownloadingSingle || isCopying}
                                        className={`
                                        flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                        ${cards.length === 0 || isDownloadingSingle || isCopying
                                                ? 'opacity-50 cursor-not-allowed bg-slate-500/10 text-slate-500'
                                                : darkMode
                                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'}
                                    `}
                                    >
                                        {isCopying ? <ClipboardCopy size={18} className="text-white" /> : <ClipboardCopy size={18} />}
                                        <span>{isCopying ? '¡Copiado!' : 'Al portapapeles'}</span>
                                    </button>

                                    <button
                                        onClick={handleDownloadSinglePNG}
                                        disabled={cards.length === 0 || isDownloadingSingle || isCopying}
                                        className={`
                                        flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                        ${cards.length === 0 || isDownloadingSingle || isCopying
                                                ? 'opacity-50 cursor-not-allowed bg-slate-500/10 text-slate-500'
                                                : darkMode
                                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'}
                                    `}
                                    >
                                        {isDownloadingSingle ? <RefreshCw size={18} className="animate-spin" /> : <ImageDown size={18} />}
                                        <span>Al computador</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {cards.length > 0 && (
                            <div className={`text-center text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {cards.length} cartones generados
                            </div>
                        )}
                    </div>

                    {/* PREVIEW GRID */}
                    <div className="flex-1 p-6 overflow-y-auto bg-dot-pattern">
                        {cards.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                                <Settings2 size={64} />
                                <p className="text-xl font-medium">Configura y genera tus cartones</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {/* Render only first 20 for preview to avoid DOM heavy load if thousands generated */}
                                {cards.slice(0, 24).map((card) => (
                                    <BingoCardPreview key={card.id} card={card} darkMode={darkMode} />
                                ))}
                                {cards.length > 24 && (
                                    <div className="flex items-center justify-center p-4 text-sm opacity-50 font-bold">
                                        + {cards.length - 24} más...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
