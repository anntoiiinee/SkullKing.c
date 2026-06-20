import { useState, useEffect } from 'react'
import { Button } from '@btcv/ui/Button'
import { Popover, PopoverTrigger, PopoverContent } from '@btcv/ui/Popover'
import { Paintbrush } from 'lucide-react'

const BG_OPTIONS = [
  { key: 'waves', label: 'Vagues' },
  { key: 'aurora', label: 'Aurora' },
  { key: 'particles', label: 'Particules' },
  { key: 'silk', label: 'Soie' },
  { key: 'squares', label: 'Carrés' },
  { key: 'threads', label: 'Fils' },
  { key: 'none', label: 'Aucun' },
] as const

export type BgKey = (typeof BG_OPTIONS)[number]['key']

const STORAGE_KEY = 'sk_background'

export function useBackground() {
  const [bg, setBg] = useState<BgKey>(() =>
    (localStorage.getItem(STORAGE_KEY) as BgKey) || 'waves'
  )
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, bg)
  }, [bg])
  return [bg, setBg] as const
}

export default function BackgroundPicker({ value, onChange }: { value: BgKey; onChange: (v: BgKey) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paintbrush className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        {BG_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
              value === opt.key
                ? 'bg-primary/20 text-primary font-medium'
                : 'hover:bg-card text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
