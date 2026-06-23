import { useState } from 'react'
import { Game, Player, BonusDetail } from '../lib/types'
import { Badge } from '@btcv/ui/Badge'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { calculateRoundScore } from '../lib/scoring'
import { saveGame } from '../lib/storage'
import { toast } from '@btcv/ui/Toast'
import { Pencil } from 'lucide-react'
import RoundInput from './RoundInput'

type Props = {
  game: Game
  players: Player[]
  currentRound: number
  onGameUpdate?: (game: Game) => void
}

type EditTarget = {
  playerId: string
  roundIndex: number
}

export default function ScoreBoard({ game, players, currentRound, onGameUpdate }: Props) {
  const getName = (id: string) => players.find(p => p.id === id)?.name || '?'
  const [editing, setEditing] = useState<EditTarget | null>(null)

  const sorted = [...game.players].sort((a, b) => b.totalScore - a.totalScore)

  const handleEditSubmit = (bid: number, tricks: number, bonusDetails: BonusDetail[]) => {
    if (!editing) return
    const { playerId, roundIndex } = editing
    const roundNumber = roundIndex + 1
    const newRoundScore = calculateRoundScore(roundNumber, bid, tricks, bonusDetails)

    const updatedGame: Game = {
      ...game,
      players: game.players.map(gp => {
        if (gp.playerId !== playerId) return gp
        const rounds = [...gp.rounds]
        rounds[roundIndex] = newRoundScore
        const totalScore = rounds.reduce((sum, r) => sum + r.score, 0)
        return { ...gp, rounds, totalScore }
      }),
    }

    saveGame(updatedGame)
    onGameUpdate?.(updatedGame)
    setEditing(null)
    toast.success(`Score de ${getName(playerId)} corrigé (M${roundNumber})`)
  }

  const editingRound = editing
    ? game.players.find(gp => gp.playerId === editing.playerId)?.rounds[editing.roundIndex]
    : null

  return (
    <div className="space-y-4">
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
                      <button
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setEditing({ playerId: gp.playerId, roundIndex: i })}
                        title="Cliquer pour modifier"
                      >
                        <Badge
                          variant={round.score >= 0 ? 'success' : 'destructive'}
                          size="sm"
                        >
                          {round.score >= 0 ? '+' : ''}{round.score}
                        </Badge>
                      </button>
                    </td>
                  )
                })}
                <td className="py-2 px-2 text-right font-bold text-primary">{gp.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && editingRound && (
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Pencil className="w-4 h-4" />
              Corriger {getName(editing.playerId)} — Manche {editing.roundIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RoundInput
              playerName={getName(editing.playerId)}
              roundNumber={editing.roundIndex + 1}
              otherPlayers={players.filter(p => p.id !== editing.playerId)}
              onSubmit={handleEditSubmit}
              defaultBid={editingRound.bid}
              defaultTricks={editingRound.tricks}
              defaultBonusDetails={editingRound.bonusDetails}
            />
            <Button variant="ghost" className="w-full" onClick={() => setEditing(null)}>
              Annuler
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
