import React from 'react';
import { PenTool, CheckCircle, ShieldCheck, Trash2, Image as ImageIcon } from 'lucide-react';

interface SignatureDisplayProps {
  signature?: string;
  signerName: string;
  roleLabel?: string;
  dateString?: string;
  isEditMode?: boolean;
  onOpenSignatureModal: () => void;
  onClearSignature?: () => void;
  compact?: boolean;
}

export const SignatureDisplay: React.FC<SignatureDisplayProps> = ({
  signature,
  signerName,
  roleLabel,
  dateString,
  isEditMode = true,
  onOpenSignatureModal,
  onClearSignature,
  compact = false,
}) => {
  const isImageSignature =
    signature &&
    (signature.startsWith('data:image/') ||
      signature.endsWith('.png') ||
      signature.endsWith('.jpg') ||
      signature.endsWith('.svg'));

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {signature ? (
          isImageSignature ? (
            <img
              src={signature}
              alt={`Firma de ${signerName}`}
              className="h-8 max-w-[120px] object-contain bg-white rounded border border-slate-200 p-0.5"
            />
          ) : (
            <span className="font-serif italic text-cyan-800 font-bold text-xs">
              {signature}
            </span>
          )
        ) : (
          <span className="text-slate-400 italic text-[11px]">Sin firma</span>
        )}

        {isEditMode && (
          <button
            type="button"
            onClick={onOpenSignatureModal}
            className="p-1 text-slate-500 hover:text-cyan-600 rounded hover:bg-slate-100 transition cursor-pointer"
            title="Cambiar firma (Subir PNG / Dibujar)"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2 relative group hover:border-slate-300 transition">
      {/* Role Tag */}
      {roleLabel && (
        <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
          {roleLabel}
        </div>
      )}

      {/* Signature Render Box */}
      <div className="min-h-16 flex items-center justify-center p-2 bg-white/80 rounded-lg border border-slate-200/80 shadow-2xs">
        {signature ? (
          isImageSignature ? (
            <div className="space-y-1">
              <img
                src={signature}
                alt={`Firma de ${signerName}`}
                className="max-h-16 max-w-[240px] object-contain mx-auto"
              />
              <div className="flex items-center justify-center gap-1 text-[9px] text-emerald-700 font-mono font-semibold">
                <CheckCircle className="w-2.5 h-2.5" />
                <span>Firma PNG verificada</span>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="font-serif italic font-bold text-slate-900 text-lg">
                {signature}
              </div>
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500 font-mono">
                <ShieldCheck className="w-2.5 h-2.5 text-cyan-600" />
                <span>Certificado Digital</span>
              </div>
            </div>
          )
        ) : (
          <div className="text-slate-400 italic text-xs py-3 border border-dashed border-slate-300 rounded-lg w-full">
            Pendiente de firma
          </div>
        )}
      </div>

      {/* Signer Details */}
      <div className="border-t border-slate-200 pt-2 space-y-0.5">
        <div className="font-bold text-slate-900 text-xs">{signerName || 'Auditor'}</div>
        {dateString && (
          <div className="text-slate-500 text-[10px] font-mono">
            Fecha: {dateString}
          </div>
        )}
      </div>

      {/* Edit Controls */}
      {isEditMode && (
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onOpenSignatureModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <PenTool className="w-3 h-3 text-cyan-400" />
            <span>{signature ? 'Cambiar Firma (PNG / Digital)' : 'Agregar Firma (PNG / Digital)'}</span>
          </button>

          {signature && onClearSignature && (
            <button
              type="button"
              onClick={onClearSignature}
              className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
              title="Borrar firma"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
