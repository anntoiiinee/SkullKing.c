import { Game, Player } from './types'

const PLAYERS_KEY = 'sk_players'
const GAMES_KEY = 'sk_games'

export function getPlayers(): Player[] {
  const raw = localStorage.getItem(PLAYERS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function savePlayer(player: Player) {
  const players = getPlayers()
  const idx = players.findIndex(p => p.id === player.id)
  if (idx >= 0) players[idx] = player
  else players.push(player)
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function deletePlayer(id: string) {
  const players = getPlayers().filter(p => p.id !== id)
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function getGames(): Game[] {
  const raw = localStorage.getItem(GAMES_KEY)
  return raw ? JSON.parse(raw) : []
}

export function getGame(id: string): Game | undefined {
  return getGames().find(g => g.id === id)
}

export function saveGame(game: Game) {
  const games = getGames()
  const idx = games.findIndex(g => g.id === game.id)
  if (idx >= 0) games[idx] = game
  else games.push(game)
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
}

export function deleteGame(id: string) {
  const games = getGames().filter(g => g.id !== id)
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
}
