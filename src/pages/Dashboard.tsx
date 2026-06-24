import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { StatWidget } from '@btcv/ui/Widget'
import { PageTitle, PageDescription } from '@btcv/ui/Typography'
import { Badge } from '@btcv/ui/Badge'
import { Gamepad2, Users, Trophy, Clock, Play, Eye } from 'lucide-react'
import { getGames, getPlayers } from '../lib/storage'
import { Game, Player } from '../lib/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const [games, setGames] = useState<Game[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getGames(), getPlayers()]).then(([g, p]) => {
      setGames(g)
      setPlayers(p)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>

  const completedGames = games.filter(g => g.status === 'completed')
  const inProgressGames = games.filter(g => g.status === 'in_progress')

  return (
    <div className="space-y-6">
      <div>
        <PageTitle>SkullKing.c</PageTitle>
        <PageDescription>Gérez vos parties et suivez les performances de vos joueurs.</PageDescription>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={() => navigate('/games/new')}>
          <Gamepad2 className="w-4 h-4" /> Nouvelle Partie
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate('/players')}>
          <Users className="w-4 h-4" /> Joueurs
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatWidget title="Parties jouées" value={completedGames.length.toString()} icon={Trophy} variant="primary" />
        <StatWidget title="Joueurs" value={players.length.toString()} icon={Users} variant="primary" />
        <StatWidget title="En cours" value={inProgressGames.length.toString()} icon={Clock} variant="primary" />
      </div>

      {inProgressGames.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Parties en cours</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {inProgressGames.map(game => (
              <div key={game.id} className="flex items-center justify-between rounded-md bg-card/50 px-4 py-3">
                <div>
                  <span className="font-medium">{game.players.length} joueurs</span>
                  <Badge variant="warning" size="sm" className="ml-2">Manche {game.currentRound + 1}/10</Badge>
                </div>
                <Button variant="primary" size="sm" onClick={() => navigate(`/games/${game.id}`)}>
                  <Play className="w-3.5 h-3.5" /> Reprendre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {completedGames.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Dernières parties</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {completedGames.slice(-5).reverse().map(game => {
              const winner = [...game.players].sort((a, b) => b.totalScore - a.totalScore)[0]
              const winnerName = players.find(p => p.id === winner?.playerId)?.name || '?'
              return (
                <div key={game.id} className="flex items-center justify-between rounded-md bg-card/50 px-4 py-3">
                  <div>
                    <span className="text-sm text-muted-foreground">{new Date(game.completedAt || game.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="ml-2 font-medium">🏆 {winnerName}</span>
                    <span className="ml-1 text-primary font-bold">{winner?.totalScore} pts</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/games/${game.id}/results`)}>
                    <Eye className="w-3.5 h-3.5" /> Voir
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
