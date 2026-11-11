import React, { useState } from 'react';
import { Trash2, AlertTriangle, RefreshCw, CheckCircle, ShieldAlert, Monitor, Smartphone } from 'lucide-react';
import { useAudit } from '../context/AuditContext';

export const UninstallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { resetAllToFactory, triggerSaveNotification } = useAudit();
  const [clearedSuccess, setClearedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClearDataAndUninstall = async () => {
    // 1. Unregister service workers if supported
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      } catch (err) {
        console.warn('Error unregistering service workers:', err);
      }
    }

    // 2. Clear local storage cache
    resetAllToFactory();
    setClearedSuccess(true);
    triggerSaveNotification('Datos locales y caché de aplicación restablecidos');

    setTimeout(() => {
      setClearedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">
                Desinstalar y Restablecer Aplicación
              </h3>
              <p className="text-xs text-slate-400">
                Gestión del estado PWA y almacenamiento local en Impresos El Día.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-600">
          {clearedSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">¡Caché y datos locales eliminados!</div>
              <p className="text-xs text-emerald-700">
                La aplicación se ha restablecido a los valores oficiales de fábrica.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Restablecimiento de Ciclo:</strong> Al limpiar los datos locales, se eliminarán las modificaciones guardadas en este navegador y la plataforma volverá a los formatos iniciales de Impresos El Día S.A.S.
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[11px] block">
                  Instrucciones para Desinstalar del Dispositivo:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <Monitor className="w-3.5 h-3.5 text-cyan-600" />
                      <span>En PC / Mac (Chrome / Edge):</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Haz clic en los 3 puntos (⋮) de la barra superior de la ventana de la app y selecciona <em>"Desinstalar Impresos El Día..."</em>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>En Celular (Android / iOS):</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Mantén presionado el icono de la app en la pantalla de inicio y toca <em>"Desinstalar"</em> o <em>"Eliminar marcador"</em>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleClearDataAndUninstall}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Datos y Restablecer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
