'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CvElementContent, elementBoxStyle, textStyle } from '@/components/cv/cv-element'
import type { CvElement, TextElement } from '@/lib/cv/types'
import { type ElementPatch, useEditor } from '@/lib/store/editor'
import { SelectionOverlay } from './selection-overlay'
import { ElementContextMenu } from './element-context-menu'

export type Guides = { v: number[]; h: number[] }

function AutoHeightText({ el }: { el: TextElement }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const patch = useEditor((s) => s.patch)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const h = Math.ceil(node.offsetHeight)
    if (Math.abs(h - el.h) > 1) patch(el.id, { h }, false)
  })
  return (
    <p ref={ref} style={textStyle(el)}>
      {el.text || '\u00a0'}
    </p>
  )
}

function EditableText({ el }: { el: TextElement }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { patch, setEditing, checkpoint } = useEditor.getState()

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    checkpoint()
    node.textContent = el.text
    node.focus()
    const range = document.createRange()
    range.selectNodeContents(node)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    // Only on mount: the DOM owns the text while editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = () => {
    const node = ref.current
    if (!node) return
    patch(el.id, { text: node.innerText.replace(/\n$/, ''), h: Math.ceil(node.offsetHeight) }, false)
  }

  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Modifier le texte"
      spellCheck
      style={{ ...textStyle(el), outline: 'none', cursor: 'text', caretColor: 'var(--primary)' }}
      onInput={sync}
      onBlur={() => {
        sync()
        setEditing(null)
      }}
      onPaste={(e) => {
        e.preventDefault()
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
      }}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Escape') (e.target as HTMLElement).blur()
      }}
      onPointerDown={(e) => e.stopPropagation()}
    />
  )
}

const SNAP = 6

export function EditorCanvas() {
  const design = useEditor((s) => s.design)
  const zoom = useEditor((s) => s.zoom)
  const selected = useEditor((s) => s.selected)
  const editingId = useEditor((s) => s.editingId)
  const viewportRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [guides, setGuides] = useState<Guides>({ v: [], h: [] })
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [hud, setHud] = useState<{ text: string; x: number; y: number } | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

  const toPage = useCallback(
    (clientX: number, clientY: number) => {
      const rect = pageRef.current!.getBoundingClientRect()
      return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom }
    },
    [zoom],
  )

  const fitToScreen = useCallback(() => {
    const vp = viewportRef.current
    const d = useEditor.getState().design
    if (!vp || !d) return
    const z = Math.min((vp.clientWidth - 96) / d.width, (vp.clientHeight - 96) / d.height)
    useEditor.getState().setZoom(Math.max(0.2, Math.round(z * 100) / 100))
  }, [])

  useEffect(() => {
    fitToScreen()
    const onFit = () => fitToScreen()
    window.addEventListener('cvea:fit', onFit)
    return () => window.removeEventListener('cvea:fit', onFit)
  }, [fitToScreen])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const { zoom: z, setZoom } = useEditor.getState()
      setZoom(Math.round((z * (e.deltaY > 0 ? 0.92 : 1.08)) * 100) / 100)
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  const computeSnap = (box: { x: number; y: number; w: number; h: number }, ignore: Set<string>) => {
    const d = useEditor.getState().design!
    const threshold = SNAP / zoom
    const vTargets = [0, d.width / 2, d.width]
    const hTargets = [0, d.height / 2, d.height]
    for (const el of d.elements) {
      if (ignore.has(el.id) || el.hidden) continue
      vTargets.push(el.x, el.x + el.w / 2, el.x + el.w)
      hTargets.push(el.y, el.y + el.h / 2, el.y + el.h)
    }
    const snapAxis = (start: number, size: number, targets: number[]) => {
      const points = [start, start + size / 2, start + size]
      let best: { delta: number; line: number } | null = null
      for (const p of points) {
        for (const t of targets) {
          const delta = t - p
          if (Math.abs(delta) <= threshold && (!best || Math.abs(delta) < Math.abs(best.delta))) best = { delta, line: t }
        }
      }
      return best
    }
    const sx = snapAxis(box.x, box.w, vTargets)
    const sy = snapAxis(box.y, box.h, hTargets)
    return { dx: sx?.delta ?? 0, dy: sy?.delta ?? 0, guides: { v: sx ? [sx.line] : [], h: sy ? [sy.line] : [] } }
  }

  const startMove = (e: React.PointerEvent, el: CvElement) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const st = useEditor.getState()
    if (st.editingId === el.id) return
    if (e.shiftKey) {
      st.toggleSelect(el.id)
      return
    }
    if (!st.selected.includes(el.id)) st.select([el.id])
    const ids = useEditor.getState().selected
    const moving = st.design!.elements.filter((x) => ids.includes(x.id) && !x.locked)
    if (!moving.length) return
    const start = toPage(e.clientX, e.clientY)
    const origin = Object.fromEntries(moving.map((m) => [m.id, { x: m.x, y: m.y }]))
    const bbox = {
      x: Math.min(...moving.map((m) => m.x)),
      y: Math.min(...moving.map((m) => m.y)),
      w: Math.max(...moving.map((m) => m.x + m.w)) - Math.min(...moving.map((m) => m.x)),
      h: Math.max(...moving.map((m) => m.y + m.h)) - Math.min(...moving.map((m) => m.y)),
    }
    const ignore = new Set(moving.map((m) => m.id))
    let started = false

    const onMove = (ev: PointerEvent) => {
      const p = toPage(ev.clientX, ev.clientY)
      let dx = p.x - start.x
      let dy = p.y - start.y
      if (!started) {
        if (Math.hypot(dx, dy) * zoom < 3) return
        started = true
        useEditor.getState().checkpoint()
      }
      const snap = ev.altKey ? { dx: 0, dy: 0, guides: { v: [], h: [] } } : computeSnap({ ...bbox, x: bbox.x + dx, y: bbox.y + dy }, ignore)
      dx += snap.dx
      dy += snap.dy
      setGuides(snap.guides)
      const patches: Record<string, ElementPatch> = {}
      for (const id of Object.keys(origin)) patches[id] = { x: Math.round(origin[id].x + dx), y: Math.round(origin[id].y + dy) }
      useEditor.getState().patchMany(patches, false)
      setHud({ text: `x ${Math.round(bbox.x + dx)} · y ${Math.round(bbox.y + dy)}`, x: ev.clientX, y: ev.clientY })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setGuides({ v: [], h: [] })
      setHud(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const startMarquee = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    setMenu(null)
    const st = useEditor.getState()
    if (st.editingId) {
      ;(document.activeElement as HTMLElement | null)?.blur()
    }
    const start = toPage(e.clientX, e.clientY)
    if (!e.shiftKey) st.select([])
    const onMove = (ev: PointerEvent) => {
      const p = toPage(ev.clientX, ev.clientY)
      const box = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y) }
      setMarquee(box)
      if (box.w * zoom < 4 && box.h * zoom < 4) return
      const hits = useEditor
        .getState()
        .design!.elements.filter(
          (el) => !el.locked && !el.hidden && el.x < box.x + box.w && el.x + el.w > box.x && el.y < box.y + box.h && el.y + el.h > box.y,
        )
        .map((el) => el.id)
      useEditor.setState({ selected: hits })
    }
    const onUp = () => {
      setMarquee(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  if (!design) return null

  return (
    <div
      ref={viewportRef}
      className="editor-checker relative flex-1 overflow-auto"
      onPointerDown={startMarquee}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex min-h-full min-w-full items-center justify-center p-12" style={{ width: 'max-content' }}>
        <div className="relative" style={{ width: design.width * zoom, height: design.height * zoom }}>
          <div
            ref={pageRef}
            id="cv-editor-page"
            role="application"
            aria-label="Page du CV"
            className="absolute left-0 top-0 origin-top-left overflow-hidden shadow-cv"
            style={{ width: design.width, height: design.height, background: design.background, transform: `scale(${zoom})` }}
          >
            {design.elements.map((el) => {
              if (el.hidden) return null
              const editing = editingId === el.id && el.type === 'text'
              return (
                <div
                  key={el.id}
                  style={{ ...elementBoxStyle(el), height: el.type === 'text' ? 'auto' : el.h, cursor: el.locked ? 'default' : 'move' }}
                  onPointerDown={(e) => startMove(e, el)}
                  onPointerEnter={() => setHovered(el.id)}
                  onPointerLeave={() => setHovered((h) => (h === el.id ? null : h))}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    if (el.type === 'text' && !el.locked) {
                      useEditor.getState().select([el.id])
                      useEditor.getState().setEditing(el.id)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!useEditor.getState().selected.includes(el.id)) useEditor.getState().select([el.id])
                    setMenu({ x: e.clientX, y: e.clientY })
                  }}
                >
                  {editing ? (
                    <EditableText el={el} />
                  ) : el.type === 'text' ? (
                    <AutoHeightText el={el} />
                  ) : (
                    <CvElementContent el={el} />
                  )}
                </div>
              )
            })}
          </div>

          <SelectionOverlay
            hovered={hovered && !selected.includes(hovered) ? hovered : null}
            toPage={toPage}
            computeSnap={computeSnap}
            setGuides={setGuides}
            setHud={setHud}
            openMenu={(x, y) => setMenu({ x, y })}
          />

          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {guides.v.map((x) => (
              <div key={`v${x}`} className="absolute top-0 h-full w-px bg-accent-pink" style={{ left: x * zoom }} />
            ))}
            {guides.h.map((y) => (
              <div key={`h${y}`} className="absolute left-0 h-px w-full bg-accent-pink" style={{ top: y * zoom }} />
            ))}
            {marquee && (
              <div
                className="absolute border border-primary bg-primary/10"
                style={{ left: marquee.x * zoom, top: marquee.y * zoom, width: marquee.w * zoom, height: marquee.h * zoom }}
              />
            )}
          </div>
        </div>
      </div>

      {hud && (
        <div
          className="pointer-events-none fixed z-50 rounded-md bg-ink px-2 py-1 text-xs font-semibold tabular-nums text-white"
          style={{ left: hud.x + 14, top: hud.y + 18 }}
        >
          {hud.text}
        </div>
      )}
      {menu && <ElementContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} />}
    </div>
  )
}
