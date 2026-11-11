import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Upload,
  Type,
  Trash2,
  Check,
  X,
  FileImage,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Download,
} from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialSignerName?: string;
  currentSignature?: string;
  onSaveSignature: (signatureDataUrl: string, signerName?: string, dateString?: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  title,
  initialSignerName = '',
  currentSignature,
  onSaveSignature,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'draw' | 'type'>('upload');
  const [signerName, setSignerName] = useState(initialSignerName);
  const [penColor, setPenColor] = useState('#0f172a');
  const [penSize, setPenSize] = useState(2.5);
  const [selectedFont, setSelectedFont] = useState<'font-serif' | 'font-sans' | 'font-mono'>('font-serif');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setSignerName(initialSignerName);
      setUploadedPreview(currentSignature && currentSignature.startsWith('data:image/') ? currentSignature : null);
      setTimeout(() => initCanvas(), 100);
    }
  }, [isOpen, initialSignerName, currentSignature]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawing.current = true;
    hasDrawn.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (activeTab === 'upload') {
      if (!uploadedPreview) {
        alert('Por favor selecciona o sube una imagen PNG de firma.');
        return;
      }
      onSaveSignature(uploadedPreview, signerName, dateStr);
      onClose();
    } else if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn.current) {
        alert('Por favor dibuja tu firma en el recuadro antes de guardar.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl, signerName, dateStr);
      onClose();
    } else {
      // Type mode: render text signature to canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 450;
      offscreenCanvas.height = 150;
      const ctx = offscreenCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 450, 150);

        // Digital seal background line
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(30, 110);
        ctx.lineTo(420, 110);
        ctx.stroke();

        // Signature cursive text
        ctx.fillStyle = penColor;
        ctx.font = 'italic 34px "Times New Roman", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(signerName || 'Firma Digital', 225, 80);

        // Subtext / Digital stamp
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 9px Arial, sans-serif';
        ctx.fillText(`FIRMADO DIGITALMENTE · IMPRESOS EL DÍA S.A.S. · ${dateStr}`, 225, 128);

        const dataUrl = offscreenCanvas.toDataURL('image/png');
        onSaveSignature(dataUrl, signerName, dateStr);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">
                {title || 'Gestión de Firma Digital del Auditor'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Sube una imagen PNG, dibuja con el mouse/pantalla táctil o genera firma formal.
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'upload'
                ? 'border-cyan-600 text-cyan-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1. Subir PNG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('draw');
              setTimeout(() => initCanvas(), 50);
            }}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'draw'
                ? 'border-cyan-600 text-cyan-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>2. Dibujar en Pantalla</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'type'
                ? 'border-cyan-600 text-cyan-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>3. Firma Tipográfica</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Signer Name Input */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nombre del Firmante / Auditor:</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Nombre del auditor o revisor de la auditoría..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-cyan-600 bg-white"
            />
          </div>

          {/* TAB 1: UPLOAD PNG */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="block text-slate-600 font-medium">
                Selecciona una firma digital en formato PNG (preferiblemente con fondo transparente o blanco):
              </label>

              <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-xl p-6 text-center transition bg-slate-50/50 flex flex-col items-center justify-center relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                {uploadedPreview ? (
                  <div className="space-y-2">
                    <img
                      src={uploadedPreview}
                      alt="Firma subida"
                      className="max-h-24 max-w-full object-contain mx-auto border border-slate-200 rounded p-1 bg-white shadow-xs"
                    />
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Imagen PNG cargada correctamente</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Haz clic o arrastra para cambiar por otra imagen
                    </span>
                  </div>
                ) : (
                  <>
                    <FileImage className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-700 text-xs">
                      Haz clic aquí o arrastra tu archivo PNG
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Soporta PNG, JPEG, SVG y WEBP
                    </span>
                  </>
                )}
              </div>

              {/* Quick Preset Signatures */}
              <div className="pt-2">
                <span className="font-semibold text-slate-500 text-[11px] block mb-1.5">
                  Firmas Predefinidas Rápidas (Auditores de Impresos El Día):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Auditor Líder SGC', role: 'Líder Auditor' },
                    { name: 'Director de Calidad / Revisor', role: 'Revisión SGC' },
                    { name: 'Jorge E. Ramírez', role: 'Líder de Impresión' },
                    { name: 'Claudia Restrepo', role: 'Auditora Técnica' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSignerName(preset.name);
                        // Generate a clean stylized signature on the fly
                        const c = document.createElement('canvas');
                        c.width = 400;
                        c.height = 120;
                        const ctx = c.getContext('2d');
                        if (ctx) {
                          ctx.clearRect(0, 0, 400, 120);
                          ctx.fillStyle = '#0f172a';
                          ctx.font = 'italic 28px "Times New Roman", serif';
                          ctx.textAlign = 'center';
                          ctx.fillText(preset.name, 200, 65);
                          ctx.strokeStyle = '#0284c7';
                          ctx.lineWidth = 1;
                          ctx.beginPath();
                          ctx.moveTo(30, 85);
                          ctx.lineTo(370, 85);
                          ctx.stroke();
                          setUploadedPreview(c.toDataURL('image/png'));
                        }
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[11px] text-slate-700 transition cursor-pointer"
                    >
                      {preset.name.split(' ')[0]} ({preset.role})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRAW ON CANVAS */}
          {activeTab === 'draw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Dibuja con el mouse o en tu pantalla táctil:</span>
                <div className="flex items-center gap-2">
                  {/* Color pickers */}
                  <div className="flex items-center gap-1">
                    {[
                      { color: '#0f172a', label: 'Negro' },
                      { color: '#1e3a8a', label: 'Azul Marino' },
                      { color: '#0369a1', label: 'Azul Real' },
                    ].map((item) => (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => setPenColor(item.color)}
                        className={`w-5 h-5 rounded-full border-2 transition cursor-pointer ${
                          penColor === item.color ? 'border-cyan-500 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.label}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] transition cursor-pointer"
                    title="Borrar lienzo"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="border border-slate-300 rounded-xl bg-slate-50/50 p-2 overflow-hidden shadow-inner flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={150}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="bg-white border border-slate-200 rounded-lg cursor-crosshair touch-none w-full max-w-[420px] h-[150px]"
                />
                <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-1 px-2">
                  <span>Línea base de firma</span>
                  <span>Formato transparente PNG</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPE FORMAL SIGNATURE */}
          {activeTab === 'type' && (
            <div className="space-y-3">
              <label className="block text-slate-600 font-medium">
                Vista previa de la firma caligráfica formal con sello digital ISO 9001:
              </label>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                <div className="font-serif italic text-2xl text-slate-900 tracking-wide">
                  {signerName || 'Nombre del Auditor'}
                </div>
                <div className="border-t border-cyan-600 w-3/4 mx-auto pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Sello Digital: IMPRESOS EL DÍA S.A.S. · ISO 9001:2015</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aplicar Firma Digital</span>
          </button>
        </div>
      </div>
    </div>
  );
};
