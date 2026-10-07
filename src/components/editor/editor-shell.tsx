'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Circle, Download, ImagePlus, Minus, Minus as LineIcon, Palette, Plus, Redo2, Save, Square, Type, Undo2, X } from 'lucide-react'
import { EditorCanvas } from '@/components/editor/editor-canvas'
import { StylePanel } from '@/components/editor/style-panel'
import { makeCircle, makeLine, makeRect, makeText } from '@/lib/cv/builder'
import { PAGE_HEIGHT, PAGE_WIDTH } from '@/lib/cv/types'
import { useEditor } from '@/lib/store/editor'
import { useHydrated, useLibrary } from '@/lib/store/library'

export function EditorShell({ id }: { id: string }) {
  const hydrated = useHydrated()
  const design = useEditor((s) => s.design)
  const zoom = useEditor((s) => s.zoom)
  const designs = useLibrary((s) => s.designs)
  const saveDesign = useLibrary((s) => s.saveDesign)
  const loadedId = useRef<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stylePanelOpen, setStylePanelOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  useEffect(() => {
    if (!hydrated) return
    const source = designs[id]
    if (!source) {
      setError('Ce CV n’existe plus ou n’a pas été chargé depuis le navigateur.')
      return
    }
    if (loadedId.current !== id) {
      useEditor.getState().load(source)
      loadedId.current = id
    }
  }, [designs, hydrated, id])

  useEffect(() => {
    if (!hydrated || !design || loadedId.current !== id) return
    let resetTimer: number | undefined
    const timeout = window.setTimeout(() => {
      saveDesign({ ...design, id, updatedAt: Date.now() })
      setSaved(true)
      resetTimer = window.setTimeout(() => setSaved(false), 1200)
    }, 350)
    return () => {
      window.clearTimeout(timeout)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [design, hydrated, id, saveDesign])

  const setName = (name: string) => useEditor.getState().setName(name)
  const addText = () => {
    const text = makeText({
      text: 'Nouveau texte',
      x: 70,
      y: 70,
      w: 260,
      fontSize: 18,
      color: '#14202e',
    })
    useEditor.getState().add(text)
  }
  const addShape = (type: 'rect' | 'circle' | 'line') => {
    const d = useEditor.getState().design
    if (!d) return
    const element = type === 'rect'
      ? makeRect({ x: Math.round(d.width / 2 - 60), y: Math.round(d.height / 2 - 35), w: 120, h: 70, fill: '#5CAFE7', name: 'Rectangle' })
      : type === 'circle'
        ? makeCircle({ x: Math.round(d.width / 2 - 40), y: Math.round(d.height / 2 - 40), w: 80, h: 80, fill: '#FF679D', name: 'Cercle' })
        : makeLine({ x: Math.round(d.width / 2 - 80), y: Math.round(d.height / 2), w: 160, stroke: '#14202e', strokeWidth: 2, name: 'Ligne' })
    useEditor.getState().add(element)
  }
  const addImage = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const d = useEditor.getState().design
      if (!d || typeof reader.result !== 'string') return
      const image = { id: `img_${Date.now().toString(36)}`, type: 'image' as const, src: reader.result, x: Math.round(d.width / 2 - 90), y: Math.round(d.height / 2 - 70), w: 180, h: 140, rotation: 0, opacity: 1, radius: 0, fit: 'cover' as const, stroke: 'transparent', strokeWidth: 0, name: file.name }
      useEditor.getState().add(image)
    }
    reader.readAsDataURL(file)
  }
  const exportDesign = async (format: 'png' | 'pdf') => {
    const page = document.getElementById('cv-editor-page')
    if (!page || exporting) return
    setExporting(true)
    setExportError(null)
    try {
      await document.fonts.ready
      const { toPng } = await import('html-to-image')
      const data = await toPng(page, { pixelRatio: 2, cacheBust: true, style: { transform: 'none', transformOrigin: 'top left' } })
      const baseName = (design?.name || 'mon-cv').trim().replace(/[^\p{L}\p{N}-]+/gu, '-').replace(/^-|-$/g, '') || 'mon-cv'
      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${baseName}.png`
        link.href = data
        link.click()
      } else {
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        pdf.addImage(data, 'PNG', 0, 0, 210, 297)
        pdf.save(`${baseName}.pdf`)
      }
    } catch {
      setExportError('Export impossible. Vérifiez que les images sont chargées, puis réessayez.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-editor-surface text-editor-foreground">
      <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <Link href="/mes-cv" className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-ink">
          <ArrowLeft className="size-4" /> Retour
        </Link>
        <div className="min-w-0 flex-1">
          <input
            aria-label="Nom du CV"
            value={design?.name ?? 'Chargement…'}
            onChange={(event) => setName(event.target.value)}
            className="w-full max-w-md truncate border-0 bg-transparent font-display text-lg font-extrabold text-ink outline-none"
          />
          <p className="text-xs text-muted-foreground">Enregistrement automatique dans ce navigateur</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-sm">
          <button aria-label="Annuler" onClick={() => useEditor.getState().undo()} className="grid size-8 place-items-center rounded-full hover:bg-muted"><Undo2 className="size-4" /></button>
          <button aria-label="Refaire" onClick={() => useEditor.getState().redo()} className="grid size-8 place-items-center rounded-full hover:bg-muted"><Redo2 className="size-4" /></button>
          <button aria-label="Réduire" onClick={() => useEditor.getState().setZoom(zoom - 0.1)} className="grid size-8 place-items-center rounded-full hover:bg-muted"><Minus className="size-4" /></button>
          <span className="w-12 text-center text-xs font-bold">{Math.round(zoom * 100)}%</span>
          <button aria-label="Agrandir" onClick={() => useEditor.getState().setZoom(zoom + 0.1)} className="grid size-8 place-items-center rounded-full hover:bg-muted"><Plus className="size-4" /></button>
        </div>
        <button onClick={addText} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-ink"><Type className="size-4" />Texte</button>
        <button onClick={() => addShape('rect')} aria-label="Ajouter un rectangle" title="Ajouter un rectangle" className="grid size-9 place-items-center rounded-full border bg-white hover:bg-muted"><Square className="size-4" /></button>
        <button onClick={() => addShape('circle')} aria-label="Ajouter un cercle" title="Ajouter un cercle" className="grid size-9 place-items-center rounded-full border bg-white hover:bg-muted"><Circle className="size-4" /></button>
        <button onClick={() => addShape('line')} aria-label="Ajouter une ligne" title="Ajouter une ligne" className="grid size-9 place-items-center rounded-full border bg-white hover:bg-muted"><LineIcon className="size-4" /></button>
        <label className="grid size-9 cursor-pointer place-items-center rounded-full border bg-white hover:bg-muted" title="Importer une image"><ImagePlus className="size-4" /><input type="file" accept="image/*" className="sr-only" onChange={(e) => { addImage(e.target.files?.[0]); e.currentTarget.value = '' }} /></label>
        <button
          type="button"
          onClick={() => setStylePanelOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-bold text-ink shadow-sm hover:bg-muted"
          aria-expanded={stylePanelOpen}
        >
          <Palette className="size-4" aria-hidden /> Style
          {stylePanelOpen && <X className="size-3" aria-hidden />}
        </button>
        <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-xs font-bold text-muted-foreground">
          {saved ? <Check className="size-4 text-emerald-600" /> : <Save className="size-4" />}
          {saved ? 'Enregistré' : 'Enregistrement automatique'}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => exportDesign('pdf')} disabled={exporting} className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-2 text-xs font-bold text-ink hover:bg-muted disabled:opacity-50"><Download className="size-3.5" />{exporting ? 'Export…' : 'PDF'}</button>
          <button onClick={() => exportDesign('png')} disabled={exporting} className="rounded-full border bg-white px-3 py-2 text-xs font-bold text-ink hover:bg-muted disabled:opacity-50">PNG</button>
        </div>
      </header>
      {exportError && <p role="status" className="border-b bg-rose-50 px-5 py-2 text-right text-xs font-semibold text-rose-700">{exportError}</p>}

      {error ? (
        <main className="mx-auto flex max-w-2xl flex-1 items-center px-6 py-24 text-center">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold">Impossible d’ouvrir ce CV</h1>
            <p className="mt-3 text-muted-foreground">{error}</p>
            <Link href="/mes-cv" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-bold text-ink">Retour à Mes CV</Link>
          </div>
        </main>
      ) : (
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-5 py-3 text-xs text-muted-foreground">
            <span>Page {PAGE_WIDTH} × {PAGE_HEIGHT}</span>
            <span>Utilisez Ctrl + souris pour zoomer · Alt pour désactiver l’alignement</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            {stylePanelOpen && <StylePanel />}
            <EditorCanvas />
          </div>
        </main>
      )}
    </div>
  )
}
