import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { StatWidget } from '@btcv/ui/Widget'
import { PageTitle, SectionTitle } from '@btcv/ui/Typography'
import { Alert } from '@btcv/ui/Alert'
import { Trophy, Target, TrendingUp, Award, Flame, ArrowLeft, BarChart3 } from 'lucide-react'
import { getPlayers, getGames } from '../lib/storage'
import { getPlayerStats } from '../lib/stats'
import { Player, Game } from '../lib/types'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [player, setPlayer] = useState<Player | undefined>()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPlayers(), getGames()]).then(([players, g]) => {
      setPlayer(players.find(p => p.id === id))
      setGames(g)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>
  if (!player) return <Alert variant="error" title="Joueur introuvable" />

  const stats = getPlayerStats(player, games)

  const roundChartData = stats.avgScoreByRound
    .map((score, i) => ({ round: `M${i + 1}`, score }))
    .filter(d => d.score !== 0 || stats.avgScoreByRound.some(s => s !== 0))

  const tooltipStyle = {
    contentStyle: { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 },
    labelStyle: { color: 'var(--foreground)' },
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/players')}>
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      <PageTitle>{player.name}</PageTitle>

      {stats.gamesPlayed === 0 ? (
        <Alert variant="info" title="Aucune partie">Ce joueur n'a pas encore joué de partie complète.</Alert>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatWidget title="Parties" value={stats.gamesPlayed.toString()} icon={BarChart3} variant="primary" />
            <StatWidget title="Victoires" value={`${stats.wins} (${stats.winRate}%)`} icon={Trophy} variant="primary" />
            <StatWidget title="Précision" value={`${stats.bidAccuracy}%`} icon={Target} variant="primary" />
            <StatWidget title="Score moyen" value={stats.avgScore.toString()} icon={TrendingUp} variant="primary" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatWidget title="Meilleur score" value={stats.bestScore.toString()} icon={Award} variant="primary" />
            <StatWidget title="Pire score" value={stats.worstScore.toString()} icon={Award} variant="primary" />
            <StatWidget title="Série victoires" value={stats.currentWinStreak.toString()} icon={Flame} variant="primary" />
            <StatWidget title="Annonces justes" value={`${stats.correctBids}/${stats.totalBids}`} icon={Target} variant="primary" />
          </div>

          {stats.scoreHistory.length > 1 && (
            <Card>
              <CardHeader><CardTitle>Évolution du score par partie</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="gameIndex" stroke="var(--muted-foreground)" fontSize={12} label={{ value: 'Partie', position: 'bottom', fill: 'var(--muted-foreground)' }} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="score" stroke="#E7BB1D" strokeWidth={2} dot={{ r: 4, fill: '#E7BB1D' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {roundChartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Score moyen par manche</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={roundChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="round" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="score" fill="#E7BB1D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
