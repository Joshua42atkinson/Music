import React from 'react';
import { Download, Upload } from 'lucide-react';
import { exportVoixViveFile, importVoixViveFile } from '../../data/saveState';

const BLUE = '#4488ff';

export default function SettingsTab({ locale, traction, updateTraction }) {
  const exportSave = async () => { await exportVoixViveFile('adventurer'); };
  const importSave = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importVoixViveFile(file);
      window.location.reload();
    } catch {
      alert(locale === 'fr' ? 'Fichier invalide.' : 'Invalid save file.');
    }
  };

  return (
    <div>
      {/* Save / Load */}
      <div className="rounded-[14px] p-3.5 px-4 mb-3.5 bg-[rgba(68,136,255,0.04)] border border-[rgba(68,136,255,0.12)]">
        <div className="font-[EB_Garamond] italic text-white/50 text-[0.85rem] mb-2.5">
          The Memory Card
        </div>
        <div className="flex gap-2 mb-2.5">
          <button
            onClick={exportSave}
            className="flex-1 py-2.5 rounded-[10px] bg-cf-sage/10 border border-cf-sage/30 text-cf-sage cursor-pointer font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center justify-center gap-1.5"
          >
            <Download size={14} /> Save State
          </button>
          <label className="flex-1 py-2.5 rounded-[10px] bg-cf-gold/10 border border-cf-gold/30 text-cf-gold cursor-pointer font-mono text-[0.65rem] tracking-[0.1em] uppercase flex items-center justify-center gap-1.5">
            <Upload size={14} /> Load State
            <input type="file" accept=".voixvive,.json" onChange={importSave} className="hidden" />
          </label>
        </div>
        <p className="text-[0.6rem] text-white/20 font-mono leading-[1.5]">
          Your progress is saved locally. Export a <code>.voixvive</code> file to back up or transfer between devices.
        </p>
      </div>

      {/* Curriculum settings */}
      <div className="rounded-[14px] p-3.5 px-4 mb-3.5 bg-white/[0.02] border border-white/[0.06]">
        <div className="font-[EB_Garamond] italic text-white/50 text-[0.85rem] mb-2.5">
          Curriculum Rules
        </div>
        {[
          {
            label: 'Path',
            opts: [
              { val: false, key: 'sandboxMode', label: 'Guided Path', color: BLUE },
              { val: true,  key: 'sandboxMode', label: 'Open Book',   color: 'var(--cf-gold)' },
            ],
          },
          {
            label: 'Mode',
            opts: [
              { val: false, key: 'kidMode', label: 'Masterclass', color: BLUE },
              { val: true,  key: 'kidMode', label: 'Apprentice',  color: 'var(--cf-gold)' },
            ],
          },
          {
            label: 'AI',
            opts: [
              { val: true,  key: 'aiEnabled', label: 'Truebadour', color: '#cc3333' },
              { val: false, key: 'aiEnabled', label: 'Silent',     color: '#7aaa88' },
            ],
          },
        ].map(({ label, opts }) => (
          <div key={label} className="mb-2.5">
            <div className="text-[0.55rem] text-white/25 font-mono tracking-[0.1em] uppercase mb-1">{label}</div>
            <div className="flex gap-1.5">
              {opts.map(({ val, key, label: optLabel, color }) => {
                const active = traction?.settings?.[key] === val || (key === 'aiEnabled' && val === true && traction?.settings?.aiEnabled !== false);
                return (
                  <button
                    key={optLabel}
                    onClick={() => updateTraction(prev => ({ settings: { ...prev.settings, [key]: val } }))}
                    className="flex-1 py-[7px] rounded-lg cursor-pointer font-mono text-[0.6rem] tracking-[0.06em] uppercase transition-all duration-150"
                    style={{
                      background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.08)'}`,
                      color: active ? color : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {optLabel}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={exportSave}
        className="w-full py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-white/40 font-mono text-[0.65rem] tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Download size={14} /> Export Save Data
      </button>
    </div>
  );
}
