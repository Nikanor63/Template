'use client'

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, PaintBucket, Palette, RotateCcw, Underline } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useEditor } from '@/lib/store/editor'
import { SHAPE_BLOCKS, type BlockShape } from '@/lib/cv-shared/shape-blocks'
import type { TextElement } from '@/lib/cv-shared/types'

const PALETTE = ['#5CAFE7', '#14202E', '#FF679D', '#FFE361', '#FFFFFF', '#123B5A', '#A66CFF']
const FONTS = [
  ['Plus Jakarta Sans', 'var(--font-jakarta)'], ['Montserrat', 'var(--font-montserrat)'],
  ['Poppins', 'var(--font-poppins)'], ['Playfair Display', 'var(--font-playfair)'], ['Lora', 'var(--font-lora)'],
  ['Raleway', 'var(--font-raleway)'], ['Space Grotesk', 'var(--font-space)'], ['DM Serif Display', 'var(--font-dmserif)'],
  ['Lato', 'var(--font-lato)'], ['Life Savers', 'var(--font-lifesavers)'],
  ['Manrope', 'var(--font-manrope)'], ['Outfit', 'var(--font-outfit)'], ['Urbanist', 'var(--font-urbanist)'],
  ['Arial', 'Arial, sans-serif'], ['Arial Black', '"Arial Black", sans-serif'], ['Arial Narrow', '"Arial Narrow", sans-serif'],
  ['Aptos', 'Aptos, sans-serif'], ['Aptos Display', '"Aptos Display", sans-serif'], ['Calibri', 'Calibri, sans-serif'],
  ['Cambria', 'Cambria, serif'], ['Candara', 'Candara, sans-serif'], ['Comic Sans MS', '"Comic Sans MS", cursive'],
  ['Consolas', 'Consolas, monospace'], ['Constantia', 'Constantia, serif'], ['Corbel', 'Corbel, sans-serif'],
  ['Courier New', '"Courier New", monospace'], ['Franklin Gothic', '"Franklin Gothic Medium", sans-serif'],
  ['Garamond', 'Garamond, serif'], ['Georgia', 'Georgia, serif'], ['Impact', 'Impact, sans-serif'],
  ['Lucida Console', '"Lucida Console", monospace'], ['Lucida Sans', '"Lucida Sans Unicode", sans-serif'],
  ['Palatino Linotype', '"Palatino Linotype", serif'], ['Segoe UI', '"Segoe UI", sans-serif'],
  ['Tahoma', 'Tahoma, sans-serif'], ['Times New Roman', '"Times New Roman", serif'],
  ['Trebuchet MS', '"Trebuchet MS", sans-serif'], ['Verdana', 'Verdana, sans-serif'],
]

export function StylePanel() {
  const design = useEditor((s) => s.design)
  const selected = useEditor((s) => s.selected)
  const patchSelected = useEditor((s) => s.patchSelected)
  const setBackground = useEditor((s) => s.setBackground)
  const [fontMenuOpen, setFontMenuOpen] = useState(false)
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
  const shape = selectedElement?.type === 'rect' || selectedElement?.type === 'circle' ? selectedElement : null
  const shapeKind = shape?.shape ?? (shape?.type === 'circle' ? 'circle' : 'rectangle')
  const maxRadius = shape ? Math.floor(Math.min(shape.w, shape.h) / 2) : 0
  const shapeRadius = shape ? Math.min(maxRadius, Math.max(0, shape.radius >= 9999 ? maxRadius : shape.radius)) : 0

  return (
    <aside className="w-full shrink-0 overflow-y-auto border-b bg-white p-4 shadow-panel md:w-72 md:border-b-0 md:border-r">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/20 text-primary"><Palette className="size-4" aria-hidden /></span>
        <div><h2 className="font-display text-sm font-extrabold text-ink">{selectedElement?.name ?? (text ? 'Texte' : 'Style')}</h2><p className="text-xs text-muted-foreground">{selectedElement ? 'Propriétés de l’élément' : 'Personnalisez votre CV'}</p></div>
      </div>

      {text && <section className="mb-6 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground" id="text-font-label">Police</label>
        <div className="relative">
          <button type="button" aria-labelledby="text-font-label" aria-expanded={fontMenuOpen} onClick={() => setFontMenuOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl border bg-white p-2 text-left text-sm text-ink">
            <span>{FONTS.find(([, value]) => value === text.fontFamily)?.[0] ?? 'Police personnalisée'}</span>
            <span aria-hidden className="text-xl leading-none" style={{ fontFamily: text.fontFamily }}>Aa</span>
          </button>
          {fontMenuOpen && <div role="listbox" aria-label="Choisir une police" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-xl">
            {FONTS.map(([name, value]) => <button key={value} type="button" role="option" aria-selected={text.fontFamily === value} onClick={() => { patchSelected({ fontFamily: value }); setFontMenuOpen(false) }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${text.fontFamily === value ? 'bg-primary/10 font-bold text-ink' : 'text-muted-foreground'}`}>
              <span>{name}</span><span aria-hidden className="text-xl leading-none text-ink" style={{ fontFamily: value }}>Aa</span>
            </button>)}
          </div>}
        </div>
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
          <label htmlFor="style-color" className="relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl border border-black/10" style={{ background: currentColor }} aria-label="Choisir une couleur">
            <input id="style-color" type="color" value={currentColor.startsWith('#') ? currentColor : '#14202e'} onChange={(e) => selectedElement ? setColor(e.target.value) : setBackground(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
          </label>
          <p className="truncate text-sm font-bold text-ink">{selectedElement ? selectedElement.name ?? selectedElement.type : 'Fond du CV'}</p>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">{PALETTE.map((color) => <button key={color} type="button" aria-label={`Utiliser la couleur ${color}`} onClick={() => selectedElement ? setColor(color) : setBackground(color)} className="aspect-square rounded-lg border border-black/10 transition-transform hover:scale-105" style={{ backgroundColor: color }} />)}</div>
        {shape && <div className="mt-4 space-y-3 rounded-xl border bg-surface p-3">
          <label className="block text-xs font-bold text-muted-foreground" htmlFor="block-shape">Forme du bloc
            <select id="block-shape" value={shapeKind} onChange={(event) => {
              const nextShape = event.target.value as BlockShape
              patchSelected({ shape: nextShape, type: nextShape === 'circle' ? 'circle' : 'rect', radius: nextShape === 'circle' ? 9999 : 0, customPath: undefined })
            }} className="mt-1 w-full rounded-lg border bg-white p-2 text-sm text-ink">
              {SHAPE_BLOCKS.map((item) => <option key={item.shape} value={item.shape}>{item.label}</option>)}
            </select>
          </label>
          {shapeKind === 'wave' && <>
            <Range label="Déformation" min={0} max={42} step={1} value={shape.waveAmplitude ?? 20} display={`${shape.waveAmplitude ?? 20}%`} onChange={(value) => patchSelected({ waveAmplitude: value }, false)} />
            <Range label="Nombre de vagues" min={1} max={8} step={1} value={shape.waveCount ?? 2} display={`${shape.waveCount ?? 2}`} onChange={(value) => patchSelected({ waveCount: value }, false)} />
            <Range label="Déplacement horizontal" min={0} max={100} step={1} value={shape.wavePhase ?? 0} display={`${shape.wavePhase ?? 0}%`} onChange={(value) => patchSelected({ wavePhase: value }, false)} />
          </>}
          {(shapeKind === 'rectangle' || shapeKind === 'circle') && <>
            <p className="text-[11px] leading-relaxed text-muted-foreground">Déforme chaque côté indépendamment. Les réglages peuvent se combiner.</p>
            <Range label="Côté supérieur" min={0} max={35} step={1} value={shape.deformTop ?? 0} display={`${shape.deformTop ?? 0}%`} onChange={(value) => patchSelected({ deformTop: value }, false)} />
            <Range label="Côté droit" min={0} max={35} step={1} value={shape.deformRight ?? 0} display={`${shape.deformRight ?? 0}%`} onChange={(value) => patchSelected({ deformRight: value }, false)} />
            <Range label="Côté inférieur" min={0} max={35} step={1} value={shape.deformBottom ?? 0} display={`${shape.deformBottom ?? 0}%`} onChange={(value) => patchSelected({ deformBottom: value }, false)} />
            <Range label="Côté gauche" min={0} max={35} step={1} value={shape.deformLeft ?? 0} display={`${shape.deformLeft ?? 0}%`} onChange={(value) => patchSelected({ deformLeft: value }, false)} />
            <Range label="Ondulations par côté" min={1} max={8} step={1} value={shape.waveCount ?? 2} display={`${shape.waveCount ?? 2}`} onChange={(value) => patchSelected({ waveCount: value }, false)} />
          </>}
        </div>}
      </section>

      {selectedElement && <section className="mb-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Position et apparence</h3>
        <div className="grid grid-cols-2 gap-2">{([['X', 'x'], ['Y', 'y'], ['Largeur', 'w'], ['Hauteur', 'h']] as const).map(([label, key]) => <label key={key} className="text-xs font-semibold text-muted-foreground">{label}<input type="number" aria-label={label} value={Math.round(selectedElement[key])} onFocus={() => useEditor.getState().checkpoint()} onChange={(e) => patchSelected({ [key]: Math.max(1, Number(e.target.value) || 1) }, false)} className="mt-1 w-full rounded-lg border p-2 text-sm text-ink" /></label>)}</div>
        <Range label="Opacité" min={0} max={1} step={0.05} value={selectedElement.opacity} display={`${Math.round(selectedElement.opacity * 100)}%`} onChange={(v) => patchSelected({ opacity: v }, false)} />
        <Range label="Rotation" min={0} max={359} step={1} value={selectedElement.rotation} display={`${selectedElement.rotation}°`} onChange={(v) => patchSelected({ rotation: v }, false)} />
        {shape && shapeKind === 'rectangle' && <Range
          label={shape.type === 'circle' ? 'Rondeur du cercle' : 'Arrondi des coins'}
          min={0}
          max={maxRadius}
          step={1}
          value={shapeRadius}
          display={`${shapeRadius} px`}
          onChange={(v) => patchSelected({ radius: v }, false)}
        />}
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
