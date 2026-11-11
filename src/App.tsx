import React from 'react';
import { AuditProvider, useAudit } from './context/AuditContext';
import { Navbar } from './components/Navbar';
import { Module1Program } from './components/Module1Program';
import { Module2Plan } from './components/Module2Plan';
import { Module3Opening } from './components/Module3Opening';
import { Module4Checklist } from './components/Module4Checklist';
import { Module5ClosingReport } from './components/Module5ClosingReport';
import { Module6Simulator } from './components/Module6Simulator';
import { Module7Evaluation } from './components/Module7Evaluation';

function MainAuditContent() {
  const { activeTab } = useAudit();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'module1_program' && <Module1Program />}
      {activeTab === 'module2_plan' && <Module2Plan />}
      {activeTab === 'module3_opening' && <Module3Opening />}
      {activeTab === 'module4_checklist' && <Module4Checklist />}
      {activeTab === 'module5_closing_report' && <Module5ClosingReport />}
      {activeTab === 'module6_simulator' && <Module6Simulator />}
      {activeTab === 'module7_evaluation' && <Module7Evaluation />}
    </main>
  );
}

export default function App() {
  return (
    <AuditProvider>
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <div className="flex-1">
          <MainAuditContent />
        </div>
        <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 print:hidden mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 tracking-tight">IMPRESOS EL DÍA S.A.S.</span>
              <span>—</span>
              <span>Sistema de Gestión de la Calidad (ISO 9001:2015 / ISO 12647-2)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Formatos Oficiales FO-MCO</span>
              <span>·</span>
              <span>Medellín, Colombia</span>
            </div>
          </div>
        </footer>
      </div>
    </AuditProvider>
  );
}
