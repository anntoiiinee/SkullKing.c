import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Input } from '@btcv/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { PageTitle, PageDescription } from '@btcv/ui/Typography'
import { toast } from '@btcv/ui/Toast'
import { UserPlus, Trash2, ChevronRight, Trophy, Target, TrendingUp } from 'lucide-react'
import { getPlayers, savePlayer, deletePlayer, getGames } from '../lib/storage'
import { getPlayerStats } from '../lib/stats'
import { Player, Game } from '../lib/types'

export default function Players() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPlayers(), getGames()]).then(([p, g]) => {
      setPlayers(p)
      setGames(g)
      setLoading(false)
    })
  }, [])

  const addPlayer = async () => {
    const name = newName.trim()
    if (!name) return
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Ce joueur existe déjà')
      return
    }
    const player: Player = { id: crypto.randomUUID(), name, createdAt: Date.now() }
    await savePlayer(player)
    setPlayers([...players, player])
    setNewName('')
    toast.success(`${name} ajouté`)
  }

  const removePlayer = async (id: string) => {
    await deletePlayer(id)
    setPlayers(players.filter(p => p.id !== id))
    toast.info('Joueur supprimé')
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>

  return (
    <div className="space-y-6">
      <div>
        <PageTitle>Joueurs</PageTitle>
        <PageDescription>Gérez vos joueurs et consultez leurs statistiques.</PageDescription>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ajouter un joueur..."
          value={newName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addPlayer()}
          className="flex-1"
        />
        <Button variant="primary" onClick={addPlayer} disabled={!newName.trim()}>
          <UserPlus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map(player => {
          const stats = getPlayerStats(player, games)
          return (
            <Card key={player.id} className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{player.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/players/${player.id}`)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.gamesPlayed > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <Trophy className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold">{stats.winRate}%</p>
                      <p className="text-xs text-muted-foreground">Win rate</p>
                    </div>
                    <div className="text-center">
                      <Target className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold">{stats.bidAccuracy}%</p>
                      <p className="text-xs text-muted-foreground">Précision</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold">{stats.avgScore}</p>
                      <p className="text-xs text-muted-foreground">Score moy.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune partie jouée</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {players.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            Aucun joueur. Ajoutez-en pour commencer !
          </CardContent>
        </Card>
      )}
    </div>
  )
}
