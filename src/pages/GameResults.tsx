import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { PageTitle, PageDescription } from '@btcv/ui/Typography'
import { Badge } from '@btcv/ui/Badge'
import { Alert } from '@btcv/ui/Alert'
import { getGame, getPlayers } from '../lib/storage'
import { Game } from '../lib/types'
import ScoreBoard from '../components/ScoreBoard'
import { Home, Trophy } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#E7BB1D', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899']

export default function GameResults() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | undefined>(() => getGame(id!))
  const players = getPlayers()

  if (!game) return <Alert variant="error" title="Partie introuvable" />

  const getName = (playerId: string) => players.find(p => p.id === playerId)?.name || '?'
  const sorted = [...game.players].sort((a, b) => b.totalScore - a.totalScore)
  const winner = sorted[0]

  const chartData = Array.from({ length: game.players[0]?.rounds.length || 0 }, (_, i) => {
    const point: Record<string, number | string> = { round: `M${i + 1}` }
    for (const gp of game.players) {
      const cumulative = gp.rounds.slice(0, i + 1).reduce((s, r) => s + r.score, 0)
      point[getName(gp.playerId)] = cumulative
    }
    return point
  })

  return (
    <div className="space-y-6">
      <div>
        <PageTitle>Résultats</PageTitle>
        <PageDescription>
          {game.completedAt && new Date(game.completedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
        </PageDescription>
      </div>

      <Card className="border-primary/30">
        <CardContent className="text-center py-8">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold">{getName(winner.playerId)}</h2>
          <p className="text-3xl font-bold text-primary">{winner.totalScore} points</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sorted.map((gp, i) => (
          <Card key={gp.playerId} className={i === 0 ? 'border-primary/30' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-muted-foreground">#{i + 1}</span>
                {getName(gp.playerId)}
                {i === 0 && <Badge variant="warning" size="sm">Vainqueur</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-primary">{gp.totalScore}</span>
              <span className="text-muted-foreground ml-1">pts</span>
              <div className="text-sm text-muted-foreground mt-1">
                Précision: {gp.rounds.filter(r => r.bid === r.tricks).length}/{gp.rounds.length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Évolution des scores</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="round" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                {game.players.map((gp, i) => (
                  <Line
                    key={gp.playerId}
                    type="monotone"
                    dataKey={getName(gp.playerId)}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <ScoreBoard game={game} players={players} currentRound={game.players[0]?.rounds.length || 0} onGameUpdate={setGame} />

      <Button variant="outline" onClick={() => navigate('/')}>
        <Home className="w-4 h-4" /> Retour à l'accueil
      </Button>
    </div>
  )
}
