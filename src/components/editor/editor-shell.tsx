'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, Redo2, Save, Undo2 } from 'lucide-react'
import { EditorCanvas } from '@/components/editor/editor-canvas'
import { makeText } from '@/lib/cv/builder'
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#eef1f4]">
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
        <button onClick={addText} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-ink">Ajouter du texte</button>
        <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-xs font-bold text-muted-foreground">
          {saved ? <Check className="size-4 text-emerald-600" /> : <Save className="size-4" />}
          {saved ? 'Enregistré' : 'Enregistrement automatique'}
        </div>
      </header>

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
          <EditorCanvas />
        </main>
      )}
    </div>
  )
}
