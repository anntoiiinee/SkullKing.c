import { Game, Player } from './types'

let players: Player[] = []
let games: Game[] = []

export async function getPlayers(): Promise<Player[]> {
  return [...players]
}

export async function savePlayer(player: Player): Promise<void> {
  const idx = players.findIndex(p => p.id === player.id)
  if (idx >= 0) players[idx] = player
  else players.push(player)
}

export async function deletePlayer(id: string): Promise<void> {
  players = players.filter(p => p.id !== id)
}

export async function getGames(): Promise<Game[]> {
  return [...games]
}

export async function getGame(id: string): Promise<Game | undefined> {
  return games.find(g => g.id === id)
}

export async function saveGame(game: Game): Promise<void> {
  const idx = games.findIndex(g => g.id === game.id)
  if (idx >= 0) games[idx] = game
  else games.push(game)
}

export async function deleteGame(id: string): Promise<void> {
  games = games.filter(g => g.id !== id)
}
