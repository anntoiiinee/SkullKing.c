import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { PageTitle } from '@btcv/ui/Typography'
import { Badge } from '@btcv/ui/Badge'
import { ProgressBar } from '@btcv/ui/ProgressBar'
import { Tabs } from '@btcv/ui/Tabs'
import { Alert } from '@btcv/ui/Alert'
import { toast } from '@btcv/ui/Toast'
import { getGame, getPlayers, saveGame } from '../lib/storage'
import { calculateRoundScore, resolveButinBonus } from '../lib/scoring'
import { BonusDetail, Game, Player } from '../lib/types'
import ScoreBoard from '../components/ScoreBoard'
import RoundInput from '../components/RoundInput'
import { ChevronRight, Square } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#E7BB1D', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899']

type RoundEntry = { bid: number; tricks: number; bonusDetails: BonusDetail[] }

export default function GamePlay() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const [game, setGame] = useState<Game | undefined>()
  const [activeTab, setActiveTab] = useState<string>('input')
  const [roundEntries, setRoundEntries] = useState<Record<string, RoundEntry>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getGame(id!), getPlayers()]).then(([g, p]) => {
      setGame(g)
      setPlayers(p)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>
  if (!game) return <Alert variant="error" title="Partie introuvable">Vérifiez l'URL.</Alert>

  if (game.status === 'completed') {
    navigate(`/games/${game.id}/results`, { replace: true })
    return null
  }

  const round = game.currentRound
  const getName = (playerId: string) => players.find(p => p.id === playerId)?.name || '?'

  const handlePlayerChange = (playerId: string, bid: number, tricks: number, bonusDetails: BonusDetail[]) => {
    setRoundEntries(prev => ({ ...prev, [playerId]: { bid, tricks, bonusDetails } }))
  }

  const finalizeRound = async () => {
    const entries: Record<string, RoundEntry> = {}
    for (const gp of game.players) {
      entries[gp.playerId] = roundEntries[gp.playerId] || { bid: 0, tricks: 0, bonusDetails: [] }
    }

    const butinAdjustments = resolveButinBonus(entries)

    const updatedGame = { ...game, players: game.players.map(gp => {
      const entry = entries[gp.playerId]
      const roundScore = calculateRoundScore(round + 1, entry.bid, entry.tricks, entry.bonusDetails)
      const butinAdj = butinAdjustments[gp.playerId] || 0
      if (butinAdj !== 0) {
        roundScore.bonus += butinAdj
        roundScore.score += butinAdj
      }
      const rounds = [...gp.rounds, roundScore]
      const totalScore = rounds.reduce((sum, r) => sum + r.score, 0)
      return { ...gp, rounds, totalScore }
    })}

    const nextRound = round + 1
    if (nextRound >= 10) {
      updatedGame.status = 'completed'
      updatedGame.completedAt = Date.now()
    }
    updatedGame.currentRound = nextRound

    await saveGame(updatedGame as Game)
    setGame(updatedGame as Game)
    setRoundEntries({})

    if (nextRound >= 10) {
      toast.success('Partie terminée !')
      navigate(`/games/${game.id}/results`)
    } else {
      toast.info(`Manche ${nextRound + 1} !`)
    }
  }

  const stopGame = async () => {
    if (round === 0) {
      toast.error('Jouez au moins une manche avant d\'arrêter')
      return
    }
    const updatedGame: Game = {
      ...game,
      status: 'completed',
      completedAt: Date.now(),
    }
    await saveGame(updatedGame)
    toast.success('Partie terminée !')
    navigate(`/games/${game.id}/results`)
  }

  const chartData = Array.from({ length: round }, (_, i) => {
    const point: Record<string, number | string> = { round: `M${i + 1}` }
    for (const gp of game.players) {
      const cumulative = gp.rounds.slice(0, i + 1).reduce((s, r) => s + r.score, 0)
      point[getName(gp.playerId)] = cumulative
    }
    return point
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>Manche {round + 1} / 10</PageTitle>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">{round + 1} carte{round + 1 > 1 ? 's' : ''} par joueur</Badge>
          <Button variant="destructive" size="sm" onClick={stopGame}>
            <Square className="w-3.5 h-3.5" /> Arrêter
          </Button>
        </div>
      </div>

      <ProgressBar value={(round / 10) * 100} variant="gold" size="md" />

      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Scores en temps réel</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
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

      <Tabs
        tabs={[
          { key: 'input', label: 'Saisie' },
          { key: 'scores', label: 'Tableau des scores' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'input' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {game.players.map(gp => (
              <RoundInput
                key={gp.playerId}
                playerName={getName(gp.playerId)}
                roundNumber={round + 1}
                otherPlayers={players.filter(p => p.id !== gp.playerId)}
                showSubmit={false}
                onChange={(bid, tricks, bonusDetails) => handlePlayerChange(gp.playerId, bid, tricks, bonusDetails)}
              />
            ))}
          </div>

          <Button variant="primary" size="lg" className="w-full" onClick={finalizeRound}>
            <ChevronRight className="w-4 h-4" />
            {round + 1 >= 10 ? 'Terminer la partie' : `Valider la manche ${round + 1}`}
          </Button>
        </div>
      ) : (
        <ScoreBoard game={game} players={players} currentRound={round} onGameUpdate={setGame} />
      )}
    </div>
  )
}
