'use client'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown } from 'lucide-react';

export default function ExportPDF({ studentName, meals }: { studentName: string, meals: any[] }) {
  const exportToPDF = async () => {
    const element = document.getElementById('diet-print-area');
    if (!element) return;

    // Mostra a área temporariamente para o print
    element.style.display = 'block';
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Dieta-${studentName.replace(/\s+/g, '-')}.pdf`);
    
    element.style.display = 'none';
  };

  return (
    <>
      <button 
        onClick={exportToPDF}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
      >
        <FileDown size={16} /> Baixar Dieta em PDF
      </button>

      {/* Área invisível que será convertida em PDF */}
      <div id="diet-print-area" style={{ display: 'none', width: '210mm', padding: '20mm', background: 'white' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>{studentName}</h1>
        <p style={{ color: '#2563eb', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Paulo Adriano Team • Shape Natural de Elite</p>
        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
        
        {meals.map((meal, idx) => (
          <div key={idx} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{meal.time} - {meal.title}</h2>
            <p style={{ fontSize: '10px', color: '#666' }}>Macros: {meal.calories}kcal | P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fats}g</p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {meal.items.map((item: any, i: number) => (
                <li key={i} style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <strong>{item.amount}</strong> {item.name} 
                  {item.substitutions && <span style={{ color: '#999', fontSize: '10px' }}> (Trocas: {item.substitutions})</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <footer style={{ marginTop: '50px', fontSize: '10px', textAlign: 'center', color: '#ccc' }}>
          Gerado pelo App Oficial SHAPE NATURAL DE ELITE
        </footer>
      </div>
    </>
  );
}