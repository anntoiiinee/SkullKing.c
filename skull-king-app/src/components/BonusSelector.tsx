import { Button } from '@btcv/ui/Button'
import { Badge } from '@btcv/ui/Badge'
import { BonusDetail, BonusType, BONUS_LABELS } from '../lib/types'
import { Minus, Plus } from 'lucide-react'

const BONUS_TYPES: BonusType[] = [
  'pirate_captured',
  'sk_captured',
  'mermaid_captured',
  'fourteen_black',
  'fourteen_color',
  'tigresse_pirate',
]

type Props = {
  details: BonusDetail[]
  onChange: (details: BonusDetail[]) => void
}

export default function BonusSelector({ details, onChange }: Props) {
  const getCount = (type: BonusType) =>
    details.find(d => d.type === type)?.count || 0

  const setCount = (type: BonusType, count: number) => {
    if (count < 0) return
    const next = details.filter(d => d.type !== type)
    if (count > 0) next.push({ type, count })
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground font-medium">Bonus</p>
      <div className="grid gap-2">
        {BONUS_TYPES.map(type => {
          const info = BONUS_LABELS[type]
          const count = getCount(type)
          return (
            <div key={type} className="flex items-center justify-between gap-2 rounded-md bg-card/50 px-3 py-2">
              <div className="flex-1 min-w-0">
                <span className="text-sm">{info.label}</span>
                <Badge variant="outline" size="sm" className="ml-2">+{info.points}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setCount(type, count - 1)} disabled={count === 0}>
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{count}</span>
                <Button variant="ghost" size="icon" onClick={() => setCount(type, count + 1)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
