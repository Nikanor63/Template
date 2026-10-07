'use client'

import { Copy, Lock, MoreHorizontal, RotateCw, Trash2, Unlock } from 'lucide-react'
import type { CvElement } from '@/lib/cv/types'
import { type ElementPatch, useEditor } from '@/lib/store/editor'
import { cn } from '@/lib/utils'
import type { Guides } from './editor-canvas'

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
type Box = { x: number; y: number; w: number; h: number }

const HANDLE_POS: Record<Handle, { left: string; top: string; cursor: string }> = {
  nw: { left: '0%', top: '0%', cursor: 'nwse-resize' },
  n: { left: '50%', top: '0%', cursor: 'ns-resize' },
  ne: { left: '100%', top: '0%', cursor: 'nesw-resize' },
  e: { left: '100%', top: '50%', cursor: 'ew-resize' },
  se: { left: '100%', top: '100%', cursor: 'nwse-resize' },
  s: { left: '50%', top: '100%', cursor: 'ns-resize' },
  sw: { left: '0%', top: '100%', cursor: 'nesw-resize' },
  w: { left: '0%', top: '50%', cursor: 'ew-resize' },
}

function handlesFor(el: CvElement): Handle[] {
  if (el.type === 'line') return ['w', 'e']
  if (el.type === 'text') return ['nw', 'ne', 'se', 'sw', 'w', 'e']
  return ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
}

export function SelectionOverlay({
  hovered,
  toPage,
  setGuides,
  setHud,
  openMenu,
}: {
  hovered: string | null
  toPage: (x: number, y: number) => { x: number; y: number }
  computeSnap: (box: Box, ignore: Set<string>) => { dx: number; dy: number; guides: Guides }
  setGuides: (g: Guides) => void
  setHud: (h: { text: string; x: number; y: number } | null) => void
  openMenu: (x: number, y: number) => void
}) {
  const design = useEditor((s) => s.design)
  const selected = useEditor((s) => s.selected)
  const zoom = useEditor((s) => s.zoom)
  const editingId = useEditor((s) => s.editingId)
  if (!design) return null

  const sel = design.elements.filter((e) => selected.includes(e.id) && !e.hidden)
  const hoverEl = hovered ? design.elements.find((e) => e.id === hovered) : undefined
  const single = sel.length === 1 ? sel[0] : null

  const startResize = (e: React.PointerEvent, el: CvElement, handle: Handle) => {
    e.stopPropagation()
    e.preventDefault()
    const st = useEditor.getState()
    st.checkpoint()
    const start = toPage(e.clientX, e.clientY)
    const origin = { ...el }
    const rad = (-el.rotation * Math.PI) / 180
    const ratio = el.w / Math.max(1, el.h)
    const corner = handle.length === 2

    const onMove = (ev: PointerEvent) => {
      const p = toPage(ev.clientX, ev.clientY)
      const rdx = p.x - start.x
      const rdy = p.y - start.y
      const dx = rdx * Math.cos(rad) - rdy * Math.sin(rad)
      const dy = rdx * Math.sin(rad) + rdy * Math.cos(rad)
      let { x, y, w, h } = origin
      if (handle.includes('e')) w = origin.w + dx
      if (handle.includes('w')) w = origin.w - dx
      if (handle.includes('s')) h = origin.h + dy
      if (handle.includes('n')) h = origin.h - dy
      w = Math.max(12, w)
      h = Math.max(origin.type === 'line' ? origin.h : 12, h)
      const keepRatio = corner && (origin.type !== 'rect' || !ev.shiftKey)
      if (keepRatio) h = w / ratio
      if (handle.includes('w')) x = origin.x + (origin.w - w)
      if (handle.includes('n')) y = origin.y + (origin.h - h)
      const patch: ElementPatch = { x: Math.round(x), y: Math.round(y), w: Math.round(w) }
      if (origin.type === 'text') {
        if (corner) {
          const k = w / origin.w
          patch.fontSize = Math.max(4, Math.round(origin.fontSize * k * 10) / 10)
          patch.letterSpacing = Math.round(origin.letterSpacing * k * 100) / 100
        }
      } else if (origin.type !== 'line') {
        patch.h = Math.round(h)
      }
      useEditor.getState().patch(origin.id, patch, false)
      setHud({ text: `l ${Math.round(w)} × h ${Math.round(origin.type === 'text' ? origin.h : h)}`, x: ev.clientX, y: ev.clientY })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setHud(null)
      setGuides({ v: [], h: [] })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const startRotate = (e: React.PointerEvent, el: CvElement) => {
    e.stopPropagation()
    e.preventDefault()
    useEditor.getState().checkpoint()
    const cx = el.x + el.w / 2
    const cy = el.y + el.h / 2
    const onMove = (ev: PointerEvent) => {
      const p = toPage(ev.clientX, ev.clientY)
      let deg = (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI - 90
      deg = ((deg % 360) + 360) % 360
      if (ev.shiftKey) deg = Math.round(deg / 15) * 15
      else for (const s of [0, 90, 180, 270, 360]) if (Math.abs(deg - s) < 4) deg = s
      deg = Math.round(deg) % 360
      useEditor.getState().patch(el.id, { rotation: deg }, false)
      setHud({ text: `${deg}°`, x: ev.clientX, y: ev.clientY })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setHud(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const bbox = sel.length
    ? {
        x: Math.min(...sel.map((s) => s.x)),
        y: Math.min(...sel.map((s) => s.y)),
        r: Math.max(...sel.map((s) => s.x + s.w)),
        b: Math.max(...sel.map((s) => s.y + s.h)),
      }
    : null
  const locked = sel.length > 0 && sel.every((s) => s.locked)
  const st = useEditor.getState()

  return (
    <div className="pointer-events-none absolute inset-0">
      {hoverEl && (
        <div
          className="absolute border-2 border-primary/70"
          style={{
            left: hoverEl.x * zoom,
            top: hoverEl.y * zoom,
            width: hoverEl.w * zoom,
            height: hoverEl.h * zoom,
            transform: hoverEl.rotation ? `rotate(${hoverEl.rotation}deg)` : undefined,
          }}
        />
      )}

      {sel.length > 1 &&
        sel.map((s) => (
          <div
            key={s.id}
            className="absolute border border-primary"
            style={{ left: s.x * zoom, top: s.y * zoom, width: s.w * zoom, height: s.h * zoom, transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined }}
          />
        ))}

      {bbox && sel.length > 1 && (
        <div
          className="absolute border-2 border-dashed border-primary"
          style={{ left: bbox.x * zoom, top: bbox.y * zoom, width: (bbox.r - bbox.x) * zoom, height: (bbox.b - bbox.y) * zoom }}
        />
      )}

      {single && (
        <div
          className={cn('absolute border-2', single.locked ? 'border-accent-yellow' : 'border-primary')}
          style={{
            left: single.x * zoom,
            top: single.y * zoom,
            width: single.w * zoom,
            height: single.h * zoom,
            transform: single.rotation ? `rotate(${single.rotation}deg)` : undefined,
          }}
        >
          {!single.locked && editingId !== single.id && (
            <>
              {handlesFor(single).map((h) => {
                const pos = HANDLE_POS[h]
                const side = h.length === 1
                const vertical = h === 'e' || h === 'w'
                return (
                  <span
                    key={h}
                    onPointerDown={(e) => startResize(e, single, h)}
                    className={cn(
                      'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 border border-black/10 bg-white shadow-card',
                      side ? (vertical ? 'h-5 w-2 rounded-full' : 'h-2 w-5 rounded-full') : 'size-3.5 rounded-full',
                    )}
                    style={{ left: pos.left, top: pos.top, cursor: pos.cursor }}
                  />
                )
              })}
              <button
                type="button"
                aria-label="Faire pivoter"
                onPointerDown={(e) => startRotate(e, single)}
                className="pointer-events-auto absolute left-1/2 top-full mt-4 grid size-7 -translate-x-1/2 cursor-grab place-items-center rounded-full bg-white shadow-panel active:cursor-grabbing"
              >
                <RotateCw className="size-3.5 text-ink" />
              </button>
            </>
          )}
        </div>
      )}

      {bbox && !editingId && (
        <div
          className="pointer-events-auto absolute flex -translate-x-1/2 items-center gap-0.5 rounded-lg bg-white p-1 shadow-panel ring-1 ring-black/5"
          style={{
            left: ((bbox.x + bbox.r) / 2) * zoom,
            top: bbox.y * zoom > 56 ? bbox.y * zoom - 52 : bbox.b * zoom + 52,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MiniButton label={locked ? 'Déverrouiller' : 'Verrouiller'} onClick={st.toggleLock}>
            {locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
          </MiniButton>
          {!locked && (
            <>
              <MiniButton label="Dupliquer" onClick={st.duplicateSelected}>
                <Copy className="size-4" />
              </MiniButton>
              <MiniButton label="Supprimer" onClick={st.removeSelected}>
                <Trash2 className="size-4" />
              </MiniButton>
            </>
          )}
          <MiniButton
            label="Plus d'options"
            onClick={(e) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              openMenu(r.left, r.bottom + 6)
            }}
          >
            <MoreHorizontal className="size-4" />
          </MiniButton>
        </div>
      )}
    </div>
  )
}

function MiniButton({ label, onClick, children }: { label: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-md text-ink hover:bg-muted"
    >
      {children}
    </button>
  )
}
