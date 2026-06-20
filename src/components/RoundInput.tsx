import { useState } from 'react'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { Input } from '@btcv/ui/Input'
import { Collapse } from '@btcv/ui/Collapse'
import { Badge } from '@btcv/ui/Badge'
import { BonusDetail } from '../lib/types'
import { calculateRoundScore } from '../lib/scoring'
import BonusSelector from './BonusSelector'
import { Sparkles } from 'lucide-react'

type Props = {
  playerName: string
  roundNumber: number
  onSubmit: (bid: number, tricks: number, bonusDetails: BonusDetail[]) => void
  defaultBid?: number
  defaultTricks?: number
  defaultBonusDetails?: BonusDetail[]
}

export default function RoundInput({ playerName, roundNumber, onSubmit, defaultBid, defaultTricks, defaultBonusDetails }: Props) {
  const [bid, setBid] = useState(defaultBid?.toString() ?? '')
  const [tricks, setTricks] = useState(defaultTricks?.toString() ?? '')
  const [bonusDetails, setBonusDetails] = useState<BonusDetail[]>(defaultBonusDetails ?? [])

  const bidNum = parseInt(bid) || 0
  const tricksNum = parseInt(tricks) || 0
  const preview = calculateRoundScore(roundNumber, bidNum, tricksNum, bonusDetails)

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
