import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@btcv/ui/Button'
import { Input } from '@btcv/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@btcv/ui/Card'
import { Badge } from '@btcv/ui/Badge'
import { PageTitle, PageDescription } from '@btcv/ui/Typography'
import { toast } from '@btcv/ui/Toast'
import { UserPlus, X, Play } from 'lucide-react'
import { getPlayers, savePlayer, saveGame } from '../lib/storage'
import { Player, Game } from '../lib/types'

export default function NewGame() {
  const navigate = useNavigate()
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlayers().then(p => {
      setExistingPlayers(p)
      setLoading(false)
    })
  }, [])

  const togglePlayer = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const addNewPlayer = async () => {
    const name = newName.trim()
    if (!name) return
    if (existingPlayers.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Ce joueur existe déjà')
      return
    }
    const player: Player = { id: crypto.randomUUID(), name, createdAt: Date.now() }
    await savePlayer(player)
    setExistingPlayers(prev => [...prev, player])
    setSelectedIds(prev => [...prev, player.id])
    setNewName('')
    toast.success(`${name} ajouté`)
  }

  const startGame = async () => {
    if (selectedIds.length < 2) {
      toast.error('Il faut au moins 2 joueurs')
      return
    }
    const game: Game = {
      id: crypto.randomUUID(),
      players: selectedIds.map(id => ({ playerId: id, rounds: [], totalScore: 0 })),
      currentRound: 0,
      status: 'in_progress',
      createdAt: Date.now(),
    }
    await saveGame(game)
    toast.success('Partie créée !')
    navigate(`/games/${game.id}`)
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Chargement...</div>

  return (
    <div className="space-y-6">
      <div>
        <PageTitle>Nouvelle Partie</PageTitle>
        <PageDescription>Sélectionnez les joueurs ou ajoutez-en de nouveaux.</PageDescription>
      </div>

      <Card>
        <CardHeader><CardTitle>Joueurs sélectionnés ({selectedIds.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {existingPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingPlayers.map(p => (
                <Badge
                  key={p.id}
                  variant={selectedIds.includes(p.id) ? 'success' : 'outline'}
                  size="sm"
                  className="cursor-pointer select-none"
                  onClick={() => togglePlayer(p.id)}
                >
                  {p.name}
                  {selectedIds.includes(p.id) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Nouveau joueur..."
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addNewPlayer()}
              className="flex-1"
            />
            <Button variant="outline" onClick={addNewPlayer} disabled={!newName.trim()}>
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="lg" onClick={startGame} disabled={selectedIds.length < 2} className="w-full">
            <Play className="w-4 h-4" /> Lancer la partie ({selectedIds.length} joueurs)
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
