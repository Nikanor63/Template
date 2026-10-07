'use client'

import { useEffect, useRef } from 'react'
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpToLine,
  Clipboard,
  Copy,
  CopyPlus,
  Lock,
  Trash2,
} from 'lucide-react'
import { useEditor } from '@/lib/store/editor'

export function ElementContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const st = useEditor.getState()
  const hasSel = useEditor((s) => s.selected.length > 0)
  const hasClip = useEditor((s) => s.clipboard.length > 0)

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', esc)
    ref.current?.querySelector('button')?.focus()
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const items = [
    { label: 'Copier', kbd: 'Ctrl+C', icon: Copy, run: st.copy, show: hasSel },
    { label: 'Coller', kbd: 'Ctrl+V', icon: Clipboard, run: st.paste, show: hasClip },
    { label: 'Dupliquer', kbd: 'Ctrl+D', icon: CopyPlus, run: st.duplicateSelected, show: hasSel },
    { label: 'Supprimer', kbd: 'Suppr', icon: Trash2, run: st.removeSelected, show: hasSel },
    'sep',
    { label: 'Mettre au premier plan', kbd: 'Ctrl+Alt+]', icon: ArrowUpToLine, run: () => st.reorder('front'), show: hasSel },
    { label: 'Avancer', kbd: 'Ctrl+]', icon: ArrowUp, run: () => st.reorder('forward'), show: hasSel },
    { label: 'Reculer', kbd: 'Ctrl+[', icon: ArrowDown, run: () => st.reorder('backward'), show: hasSel },
    { label: "Mettre à l'arrière-plan", kbd: 'Ctrl+Alt+[', icon: ArrowDownToLine, run: () => st.reorder('back'), show: hasSel },
    'sep',
    { label: 'Verrouiller / déverrouiller', kbd: 'Alt+Maj+L', icon: Lock, run: st.toggleLock, show: hasSel },
  ] as const

  const left = Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 280)
  const top = Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - 380)

  return (
    <div
      ref={ref}
      role="menu"
      className="fixed z-50 w-64 rounded-xl bg-white p-1.5 shadow-[0_10px_40px_rgba(14,34,56,0.22)] ring-1 ring-black/5"
      style={{ left, top }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item === 'sep' ? (
          <div key={`s${i}`} role="separator" className="my-1 h-px bg-border" />
        ) : item.show ? (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={() => {
              item.run()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-ink outline-none hover:bg-muted focus-visible:bg-muted"
          >
            <item.icon className="size-4 text-ink/70" aria-hidden />
            <span className="flex-1">{item.label}</span>
            <kbd className="text-xs text-muted-foreground">{item.kbd}</kbd>
          </button>
        ) : null,
      )}
    </div>
  )
}
