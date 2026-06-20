import { Game, Player } from '../lib/types'
import { Badge } from '@btcv/ui/Badge'

type Props = {
  game: Game
  players: Player[]
  currentRound: number
}

export default function ScoreBoard({ game, players, currentRound }: Props) {
  const getName = (id: string) => players.find(p => p.id === id)?.name || '?'

  const sorted = [...game.players].sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 text-muted-foreground">#</th>
            <th className="text-left py-2 px-2 text-muted-foreground">Joueur</th>
            {Array.from({ length: currentRound }, (_, i) => (
              <th key={i} className="text-center py-2 px-1 text-muted-foreground w-12">M{i + 1}</th>
            ))}
            <th className="text-right py-2 px-2 text-muted-foreground font-bold">Total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((gp, rank) => (
            <tr key={gp.playerId} className="border-b border-border/50">
              <td className="py-2 px-2">
                {rank === 0 && currentRound > 0 ? '👑' : rank + 1}
              </td>
              <td className="py-2 px-2 font-medium">{getName(gp.playerId)}</td>
              {Array.from({ length: currentRound }, (_, i) => {
                const round = gp.rounds[i]
                if (!round) return <td key={i} className="text-center py-2 px-1 text-muted-foreground">-</td>
                return (
                  <td key={i} className="text-center py-2 px-1">
                    <Badge
                      variant={round.score >= 0 ? 'success' : 'destructive'}
                      size="sm"
                    >
                      {round.score >= 0 ? '+' : ''}{round.score}
                    </Badge>
                  </td>
                )
              })}
              <td className="py-2 px-2 text-right font-bold text-primary">{gp.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
