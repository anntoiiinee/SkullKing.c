import { useState } from 'react'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { Input } from '@btcv/ui/Input'
import { Collapse } from '@btcv/ui/Collapse'
import { Badge } from '@btcv/ui/Badge'
import { BonusDetail, Player } from '../lib/types'
import { calculateRoundScore } from '../lib/scoring'
import BonusSelector from './BonusSelector'
import { Minus, Plus, Sparkles, Gift } from 'lucide-react'

type Props = {
  playerName: string
  roundNumber: number
  onSubmit: (bid: number, tricks: number, bonusDetails: BonusDetail[]) => void
  otherPlayers?: Player[]
  defaultBid?: number
  defaultTricks?: number
  defaultBonusDetails?: BonusDetail[]
}

export default function RoundInput({ playerName, roundNumber, onSubmit, otherPlayers, defaultBid, defaultTricks, defaultBonusDetails }: Props) {
  const [bid, setBid] = useState(defaultBid?.toString() ?? '')
  const [tricks, setTricks] = useState(defaultTricks?.toString() ?? '')
  const [bonusDetails, setBonusDetails] = useState<BonusDetail[]>(defaultBonusDetails ?? [])

  const bidNum = parseInt(bid) || 0
  const tricksNum = parseInt(tricks) || 0
  const preview = calculateRoundScore(roundNumber, bidNum, tricksNum, bonusDetails)

  const butinDetail = bonusDetails.find(d => d.type === 'butin')
  const butinCount = butinDetail?.count || 0
  const butinLinkedPlayer = butinDetail?.linkedPlayerId || ''

  const setButin = (count: number, linkedPlayerId: string) => {
    const next = bonusDetails.filter(d => d.type !== 'butin')
    if (count > 0 && linkedPlayerId) {
      next.push({ type: 'butin', count, linkedPlayerId })
    }
    setBonusDetails(next)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {playerName}
          <Badge variant={preview.score >= 0 ? 'success' : 'destructive'} size="sm">
            {preview.score >= 0 ? '+' : ''}{preview.score} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Plis annoncés"
            type="number"
            min={0}
            max={roundNumber}
            value={bid}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBid(e.target.value)}
          />
          <Input
            label="Plis réalisés"
            type="number"
            min={0}
            max={roundNumber}
            value={tricks}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTricks(e.target.value)}
          />
        </div>

        {bidNum > 0 && bidNum === tricksNum && (
          <Collapse title="Bonus" icon={Sparkles}>
            <BonusSelector details={bonusDetails} onChange={setBonusDetails} />
          </Collapse>
        )}

        {otherPlayers && otherPlayers.length > 0 && (
          <Collapse title="Butin" icon={Gift}>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Butin capturé</p>
              <p className="text-xs text-muted-foreground">
                +20 si les deux réussissent, 0 si un seul échoue, −20 si les deux échouent
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setButin(Math.max(0, butinCount - 1), butinLinkedPlayer)} disabled={butinCount === 0}>
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{butinCount}</span>
                  <Button variant="ghost" size="icon" onClick={() => setButin(butinCount + 1, butinLinkedPlayer || otherPlayers[0].id)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {butinCount > 0 && (
                  <select
                    className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                    value={butinLinkedPlayer}
                    onChange={e => setButin(butinCount, e.target.value)}
                  >
                    {otherPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </Collapse>
        )}

        <Button
          variant="primary"
          className="w-full"
          onClick={() => onSubmit(bidNum, tricksNum, bonusDetails)}
        >
          Valider
        </Button>
      </CardContent>
    </Card>
  )
}
