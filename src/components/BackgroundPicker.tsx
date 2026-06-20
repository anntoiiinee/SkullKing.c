import { useState, useEffect } from 'react'
import { Select, SelectItem } from '@btcv/ui/Input'

const BG_OPTIONS = [
  { key: 'waves', label: 'Vagues' },
  { key: 'aurora', label: 'Aurora' },
  { key: 'particles', label: 'Particules' },
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
    <Select
      label=""
      value={value}
      onValueChange={(v: string) => onChange(v as BgKey)}
    >
      {BG_OPTIONS.map(opt => (
        <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
      ))}
    </Select>
  )
}
