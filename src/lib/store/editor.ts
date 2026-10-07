'use client'

import { create } from 'zustand'
import { uid } from '@/lib/cv/builder'
import type {
  CvDesign,
  CvElement,
  IconElement,
  ImageElement,
  LineElement,
  ShapeElement,
  TextElement,
} from '@/lib/cv/types'

export type ElementPatch = Partial<
  Omit<TextElement, 'type' | 'id'> &
    Omit<ShapeElement, 'type' | 'id'> &
    Omit<LineElement, 'type' | 'id'> &
    Omit<ImageElement, 'type' | 'id'> &
    Omit<IconElement, 'type' | 'id'>
>

type Snapshot = { elements: CvElement[]; background: string }
type Reorder = 'front' | 'back' | 'forward' | 'backward'
export type AlignMode = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'

interface EditorState {
  design: CvDesign | null
  selected: string[]
  editingId: string | null
  zoom: number
  past: Snapshot[]
  future: Snapshot[]
  clipboard: CvElement[]
  load: (design: CvDesign) => void
  checkpoint: () => void
  patch: (id: string, patch: ElementPatch, record?: boolean) => void
  patchMany: (patches: Record<string, ElementPatch>, record?: boolean) => void
  patchSelected: (patch: ElementPatch) => void
  add: (el: CvElement | CvElement[]) => void
  removeSelected: () => void
  duplicateSelected: () => void
  copy: () => void
  paste: () => void
  select: (ids: string[]) => void
  toggleSelect: (id: string) => void
  selectAll: () => void
  setEditing: (id: string | null) => void
  reorder: (dir: Reorder) => void
  moveLayer: (id: string, toIndex: number) => void
  align: (mode: AlignMode) => void
  toggleLock: () => void
  setBackground: (color: string, record?: boolean) => void
  setName: (name: string) => void
  replaceContent: (elements: CvElement[], background: string) => void
  undo: () => void
  redo: () => void
  setZoom: (zoom: number) => void
}

const HISTORY_LIMIT = 100

function snapshot(d: CvDesign): Snapshot {
  return { elements: d.elements, background: d.background }
}

export const useEditor = create<EditorState>()((set, get) => {
  const commit = (fn: (d: CvDesign) => Partial<CvDesign>, record = true) => {
    const d = get().design
    if (!d) return
    set((s) => ({
      design: { ...d, ...fn(d) },
      past: record ? [...s.past, snapshot(d)].slice(-HISTORY_LIMIT) : s.past,
      future: record ? [] : s.future,
    }))
  }

  return {
    design: null,
    selected: [],
    editingId: null,
    zoom: 0.7,
    past: [],
    future: [],
    clipboard: [],

    load: (design) => set({ design, selected: [], editingId: null, past: [], future: [] }),

    checkpoint: () => {
      const d = get().design
      if (!d) return
      set((s) => ({ past: [...s.past, snapshot(d)].slice(-HISTORY_LIMIT), future: [] }))
    },

    patch: (id, patch, record = true) =>
      commit((d) => ({ elements: d.elements.map((el) => (el.id === id ? ({ ...el, ...patch } as CvElement) : el)) }), record),

    patchMany: (patches, record = true) =>
      commit(
        (d) => ({ elements: d.elements.map((el) => (patches[el.id] ? ({ ...el, ...patches[el.id] } as CvElement) : el)) }),
        record,
      ),

    patchSelected: (patch) => {
      const ids = new Set(get().selected)
      commit((d) => ({ elements: d.elements.map((el) => (ids.has(el.id) ? ({ ...el, ...patch } as CvElement) : el)) }))
    },

    add: (input) => {
      const list = Array.isArray(input) ? input : [input]
      commit((d) => ({ elements: [...d.elements, ...list] }))
      set({ selected: list.map((e) => e.id) })
    },

    removeSelected: () => {
      const ids = new Set(get().selected)
      if (!ids.size) return
      commit((d) => ({ elements: d.elements.filter((el) => !ids.has(el.id) || el.locked) }))
      set({ selected: [], editingId: null })
    },

    duplicateSelected: () => {
      const d = get().design
      if (!d) return
      const ids = new Set(get().selected)
      const copies = d.elements
        .filter((el) => ids.has(el.id))
        .map((el) => ({ ...el, id: uid(el.type), x: el.x + 20, y: el.y + 20, locked: false }))
      if (copies.length) get().add(copies)
    },

    copy: () => {
      const d = get().design
      if (!d) return
      const ids = new Set(get().selected)
      set({ clipboard: d.elements.filter((el) => ids.has(el.id)) })
    },

    paste: () => {
      const items = get().clipboard
      if (!items.length) return
      const copies = items.map((el) => ({ ...el, id: uid(el.type), x: el.x + 24, y: el.y + 24, locked: false }))
      set({ clipboard: copies })
      get().add(copies)
    },

    select: (ids) => set({ selected: ids, editingId: null }),
    toggleSelect: (id) =>
      set((s) => ({
        selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id],
        editingId: null,
      })),
    selectAll: () =>
      set((s) => ({ selected: s.design?.elements.filter((e) => !e.locked && !e.hidden).map((e) => e.id) ?? [] })),
    setEditing: (id) => set({ editingId: id }),

    reorder: (dir) => {
      const ids = new Set(get().selected)
      if (!ids.size) return
      commit((d) => {
        const els = [...d.elements]
        const picked = els.filter((e) => ids.has(e.id))
        const rest = els.filter((e) => !ids.has(e.id))
        if (dir === 'front') return { elements: [...rest, ...picked] }
        if (dir === 'back') return { elements: [...picked, ...rest] }
        if (dir === 'forward') {
          for (let i = els.length - 2; i >= 0; i--) {
            if (ids.has(els[i].id) && !ids.has(els[i + 1].id)) [els[i], els[i + 1]] = [els[i + 1], els[i]]
          }
        } else {
          for (let i = 1; i < els.length; i++) {
            if (ids.has(els[i].id) && !ids.has(els[i - 1].id)) [els[i], els[i - 1]] = [els[i - 1], els[i]]
          }
        }
        return { elements: els }
      })
    },

    moveLayer: (id, toIndex) =>
      commit((d) => {
        const els = [...d.elements]
        const from = els.findIndex((e) => e.id === id)
        if (from < 0) return {}
        const [item] = els.splice(from, 1)
        els.splice(Math.max(0, Math.min(els.length, toIndex)), 0, item)
        return { elements: els }
      }),

    align: (mode) => {
      const d = get().design
      if (!d) return
      const ids = new Set(get().selected)
      const targets = d.elements.filter((e) => ids.has(e.id) && !e.locked)
      if (!targets.length) return
      const multi = targets.length > 1
      const box = multi
        ? {
            x: Math.min(...targets.map((t) => t.x)),
            y: Math.min(...targets.map((t) => t.y)),
            r: Math.max(...targets.map((t) => t.x + t.w)),
            b: Math.max(...targets.map((t) => t.y + t.h)),
          }
        : { x: 0, y: 0, r: d.width, b: d.height }
      const patches: Record<string, ElementPatch> = {}
      for (const t of targets) {
        if (mode === 'left') patches[t.id] = { x: box.x }
        if (mode === 'center') patches[t.id] = { x: (box.x + box.r) / 2 - t.w / 2 }
        if (mode === 'right') patches[t.id] = { x: box.r - t.w }
        if (mode === 'top') patches[t.id] = { y: box.y }
        if (mode === 'middle') patches[t.id] = { y: (box.y + box.b) / 2 - t.h / 2 }
        if (mode === 'bottom') patches[t.id] = { y: box.b - t.h }
      }
      get().patchMany(patches)
    },

    toggleLock: () => {
      const d = get().design
      if (!d) return
      const ids = new Set(get().selected)
      const anyUnlocked = d.elements.some((e) => ids.has(e.id) && !e.locked)
      commit((dd) => ({
        elements: dd.elements.map((e) => (ids.has(e.id) ? ({ ...e, locked: anyUnlocked } as CvElement) : e)),
      }))
    },

    setBackground: (color, record = true) => commit(() => ({ background: color }), record),
    setName: (name) => commit(() => ({ name }), false),
    replaceContent: (elements, background) => {
      commit(() => ({ elements, background }))
      set({ selected: [], editingId: null })
    },

    undo: () => {
      const { past, design } = get()
      if (!past.length || !design) return
      const prev = past[past.length - 1]
      set((s) => ({
        design: { ...design, ...prev },
        past: s.past.slice(0, -1),
        future: [snapshot(design), ...s.future],
        selected: s.selected.filter((id) => prev.elements.some((e) => e.id === id)),
        editingId: null,
      }))
    },

    redo: () => {
      const { future, design } = get()
      if (!future.length || !design) return
      const next = future[0]
      set((s) => ({
        design: { ...design, ...next },
        future: s.future.slice(1),
        past: [...s.past, snapshot(design)],
        selected: s.selected.filter((id) => next.elements.some((e) => e.id === id)),
        editingId: null,
      }))
    },

    setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.1, zoom)) }),
  }
})

export function useSelectedElements() {
  const design = useEditor((s) => s.design)
  const selected = useEditor((s) => s.selected)
  return design?.elements.filter((e) => selected.includes(e.id)) ?? []
}
