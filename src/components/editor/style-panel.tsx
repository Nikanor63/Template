'use client'

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, PaintBucket, Palette, RotateCcw, Underline } from 'lucide-react'
import { useMemo } from 'react'
import { useEditor } from '@/lib/store/editor'
import type { TextElement } from '@/lib/cv/types'

const PALETTE = ['#5CAFE7', '#14202E', '#FF679D', '#FFE361', '#FFFFFF', '#123B5A', '#A66CFF']
const FONTS = [
  ['Inter', 'var(--font-inter)'], ['Plus Jakarta Sans', 'var(--font-jakarta)'], ['Montserrat', 'var(--font-montserrat)'],
  ['Poppins', 'var(--font-poppins)'], ['Playfair Display', 'var(--font-playfair)'], ['Lora', 'var(--font-lora)'],
  ['Raleway', 'var(--font-raleway)'], ['Space Grotesk', 'var(--font-space)'], ['DM Serif Display', 'var(--font-dmserif)'],
]

export function StylePanel() {
  const design = useEditor((s) => s.design)
  const selected = useEditor((s) => s.selected)
  const patchSelected = useEditor((s) => s.patchSelected)
  const setBackground = useEditor((s) => s.setBackground)
  const selectedElement = useMemo(() => design?.elements.find((element) => element.id === selected[0]), [design?.elements, selected])
  if (!design) return null

  const setColor = (color: string) => {
    if (!selectedElement) return
    if (selectedElement.type === 'text' || selectedElement.type === 'icon') patchSelected({ color })
    else if (selectedElement.type === 'rect' || selectedElement.type === 'circle') patchSelected({ fill: color })
    else patchSelected({ stroke: color })
  }
  const currentColor = selectedElement
    ? selectedElement.type === 'text' || selectedElement.type === 'icon' ? selectedElement.color
      : selectedElement.type === 'rect' || selectedElement.type === 'circle' ? selectedElement.fill
        : selectedElement.stroke
    : design.background
  const text = selectedElement?.type === 'text' ? selectedElement as TextElement : null

  return (
    <aside className="w-full shrink-0 overflow-y-auto border-b bg-white p-4 shadow-panel md:w-72 md:border-b-0 md:border-r">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/20 text-primary"><Palette className="size-4" aria-hidden /></span>
        <div><h2 className="font-display text-sm font-extrabold text-ink">{selectedElement?.name ?? (text ? 'Texte' : 'Style')}</h2><p className="text-xs text-muted-foreground">{selectedElement ? 'Propriétés de l’élément' : 'Personnalisez votre CV'}</p></div>
      </div>

      {text && <section className="mb-6 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground" htmlFor="text-content">Contenu</label>
        <textarea id="text-content" value={text.text} onFocus={() => useEditor.getState().checkpoint()} onChange={(e) => patchSelected({ text: e.target.value }, false)} rows={3} className="w-full resize-y rounded-xl border bg-white p-2.5 text-sm text-ink outline-none focus:border-primary" />
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground" htmlFor="text-font">Police</label>
        <select id="text-font" value={text.fontFamily} onChange={(e) => patchSelected({ fontFamily: e.target.value })} className="w-full rounded-xl border bg-white p-2 text-sm text-ink">
          {FONTS.map(([name, value]) => <option key={value} value={value}>{name}</option>)}
        </select>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <label htmlFor="text-size" className="text-xs font-semibold text-muted-foreground">Taille</label>
          <input id="text-size" type="number" min={6} max={120} value={text.fontSize} onFocus={() => useEditor.getState().checkpoint()} onChange={(e) => patchSelected({ fontSize: Math.max(6, Number(e.target.value) || 6) }, false)} className="w-20 rounded-lg border p-2 text-sm" />
        </div>
        <div className="flex items-center gap-1">
          <select aria-label="Graisse" value={text.fontWeight} onChange={(e) => patchSelected({ fontWeight: Number(e.target.value) })} className="min-w-0 flex-1 rounded-lg border p-2 text-sm">
            {[300, 400, 500, 600, 700, 800].map((weight) => <option key={weight} value={weight}>{weight === 300 ? 'Léger' : weight === 400 ? 'Normal' : weight === 500 ? 'Moyen' : weight === 600 ? 'Demi-gras' : weight === 700 ? 'Gras' : 'Extra-gras'}</option>)}
          </select>
          <Toggle label="Gras" active={text.fontWeight >= 700} onClick={() => patchSelected({ fontWeight: text.fontWeight >= 700 ? 400 : 700 })}><Bold className="size-4" /></Toggle>
          <Toggle label="Italique" active={!!text.italic} onClick={() => patchSelected({ italic: !text.italic })}><Italic className="size-4" /></Toggle>
          <Toggle label="Souligné" active={!!text.underline} onClick={() => patchSelected({ underline: !text.underline })}><Underline className="size-4" /></Toggle>
        </div>
        <div className="flex items-center gap-1">
          {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight], ['justify', AlignJustify]] as const).map(([align, Icon]) => <Toggle key={align} label={`Aligner ${align}`} active={text.align === align} onClick={() => patchSelected({ align })}><Icon className="size-4" /></Toggle>)}
          <Toggle label="Majuscules" active={!!text.uppercase} onClick={() => patchSelected({ uppercase: !text.uppercase })}>Aa</Toggle>
        </div>
        <Range label="Interligne" min={0.8} max={2.4} step={0.1} value={text.lineHeight} display={`${text.lineHeight.toFixed(1)}×`} onChange={(v) => patchSelected({ lineHeight: v }, false)} />
      </section>}

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between"><label htmlFor="style-color" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Couleur</label><span className="font-mono text-xs text-muted-foreground">{currentColor.toUpperCase()}</span></div>
        <div className="flex items-center gap-3 rounded-2xl border bg-muted p-2">
          <label htmlFor="style-color" className="relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl border border-black/10" style={{ backgroundColor: currentColor }} aria-label="Choisir une couleur">
            <input id="style-color" type="color" value={currentColor.startsWith('#') ? currentColor : '#14202e'} onChange={(e) => selectedElement ? setColor(e.target.value) : setBackground(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
          </label>
          <p className="truncate text-sm font-bold text-ink">{selectedElement ? selectedElement.name ?? selectedElement.type : 'Fond du CV'}</p>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">{PALETTE.map((color) => <button key={color} type="button" aria-label={`Utiliser la couleur ${color}`} onClick={() => selectedElement ? setColor(color) : setBackground(color)} className="aspect-square rounded-lg border border-black/10 transition-transform hover:scale-105" style={{ backgroundColor: color }} />)}</div>
      </section>

      {selectedElement && <section className="mb-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Position et apparence</h3>
        <div className="grid grid-cols-2 gap-2">{([['X', 'x'], ['Y', 'y'], ['Largeur', 'w'], ['Hauteur', 'h']] as const).map(([label, key]) => <label key={key} className="text-xs font-semibold text-muted-foreground">{label}<input type="number" aria-label={label} value={Math.round(selectedElement[key])} onFocus={() => useEditor.getState().checkpoint()} onChange={(e) => patchSelected({ [key]: Math.max(1, Number(e.target.value) || 1) }, false)} className="mt-1 w-full rounded-lg border p-2 text-sm text-ink" /></label>)}</div>
        <Range label="Opacité" min={0} max={1} step={0.05} value={selectedElement.opacity} display={`${Math.round(selectedElement.opacity * 100)}%`} onChange={(v) => patchSelected({ opacity: v }, false)} />
        <Range label="Rotation" min={0} max={359} step={1} value={selectedElement.rotation} display={`${selectedElement.rotation}°`} onChange={(v) => patchSelected({ rotation: v }, false)} />
      </section>}

      <section className="rounded-2xl border bg-muted/70 p-3">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink"><PaintBucket className="size-4 text-primary" aria-hidden />Fond du document</div>
        <div className="flex items-center gap-3"><input type="color" value={design.background} onChange={(e) => setBackground(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent" aria-label="Choisir le fond du document" /><span className="font-mono text-xs text-muted-foreground">{design.background.toUpperCase()}</span><button type="button" onClick={() => setBackground('#FFFFFF')} className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-muted-foreground hover:bg-white"><RotateCcw className="size-3" aria-hidden />Réinitialiser</button></div>
      </section>
    </aside>
  )
}

function Toggle({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`grid size-9 shrink-0 place-items-center rounded-lg border ${active ? 'border-primary bg-primary/10 text-ink' : 'bg-white text-muted-foreground hover:bg-muted'}`}>{children}</button>
}

function Range({ label, min, max, step, value, display, onChange }: { label: string; min: number; max: number; step: number; value: number; display: string; onChange: (value: number) => void }) {
  return <label className="block text-xs font-semibold text-muted-foreground">{label}<span className="float-right font-mono">{display}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onPointerDown={() => useEditor.getState().checkpoint()} onKeyDown={() => useEditor.getState().checkpoint()} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-primary" /></label>
}
