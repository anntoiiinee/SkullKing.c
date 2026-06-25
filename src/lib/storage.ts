import { Game, GamePlayer, Player, RoundScore } from './types'
import { supabase } from './supabase'
import * as guestStorage from './guest-storage'

let _guestMode = false
export function setGuestMode(v: boolean) { _guestMode = v }

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  return user!.id
}

export async function getPlayers(): Promise<Player[]> {
  if (_guestMode) return guestStorage.getPlayers()
  const { data } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: true })
  return (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at).getTime(),
  }))
}

export async function savePlayer(player: Player): Promise<void> {
  if (_guestMode) return guestStorage.savePlayer(player)
  const userId = await getUserId()
  await supabase.from('players').upsert({
    id: player.id,
    name: player.name,
    created_at: new Date(player.createdAt).toISOString(),
    user_id: userId,
  })
}

export async function deletePlayer(id: string): Promise<void> {
  if (_guestMode) return guestStorage.deletePlayer(id)
  await supabase.from('players').delete().eq('id', id)
}

export async function getGames(): Promise<Game[]> {
  if (_guestMode) return guestStorage.getGames()
  const { data: gamesData } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false })

  if (!gamesData?.length) return []

  const gameIds = gamesData.map(g => g.id)

  const { data: gpData } = await supabase
    .from('game_players')
    .select('*')
    .in('game_id', gameIds)

  const { data: rsData } = await supabase
    .from('round_scores')
    .select('*')
    .in('game_id', gameIds)
    .order('round_number', { ascending: true })

  return gamesData.map(g => {
    const gamePlayers = (gpData ?? []).filter(gp => gp.game_id === g.id)
    const gameRounds = (rsData ?? []).filter(rs => rs.game_id === g.id)

    const players: GamePlayer[] = gamePlayers.map(gp => {
      const rounds: RoundScore[] = gameRounds
        .filter(rs => rs.player_id === gp.player_id)
        .map(rs => ({
          bid: rs.bid,
          tricks: rs.tricks,
          bonus: rs.bonus,
          bonusDetails: rs.bonus_details,
          score: rs.score,
        }))
      const totalScore = rounds.reduce((sum, r) => sum + r.score, 0)
      return { playerId: gp.player_id, rounds, totalScore }
    })

    return {
      id: g.id,
      players,
      currentRound: g.current_round,
      status: g.status,
      createdAt: new Date(g.created_at).getTime(),
      completedAt: g.completed_at ? new Date(g.completed_at).getTime() : undefined,
    }
  })
}

export async function getGame(id: string): Promise<Game | undefined> {
  if (_guestMode) return guestStorage.getGame(id)
  const { data: g } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single()

  if (!g) return undefined

  const { data: gpData } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_id', id)

  const { data: rsData } = await supabase
    .from('round_scores')
    .select('*')
    .eq('game_id', id)
    .order('round_number', { ascending: true })

  const players: GamePlayer[] = (gpData ?? []).map(gp => {
    const rounds: RoundScore[] = (rsData ?? [])
      .filter(rs => rs.player_id === gp.player_id)
      .map(rs => ({
        bid: rs.bid,
        tricks: rs.tricks,
        bonus: rs.bonus,
        bonusDetails: rs.bonus_details,
        score: rs.score,
      }))
    const totalScore = rounds.reduce((sum, r) => sum + r.score, 0)
    return { playerId: gp.player_id, rounds, totalScore }
  })

  return {
    id: g.id,
    players,
    currentRound: g.current_round,
    status: g.status,
    createdAt: new Date(g.created_at).getTime(),
    completedAt: g.completed_at ? new Date(g.completed_at).getTime() : undefined,
  }
}

export async function saveGame(game: Game): Promise<void> {
  if (_guestMode) return guestStorage.saveGame(game)
  const userId = await getUserId()
  await supabase.from('games').upsert({
    id: game.id,
    current_round: game.currentRound,
    status: game.status,
    created_at: new Date(game.createdAt).toISOString(),
    completed_at: game.completedAt ? new Date(game.completedAt).toISOString() : null,
    user_id: userId,
  })

  const playerIds = game.players.map(gp => gp.playerId)
  await supabase.from('game_players').upsert(
    playerIds.map(pid => ({ game_id: game.id, player_id: pid }))
  )

  const roundScores = game.players.flatMap(gp =>
    gp.rounds.map((rs, i) => ({
      game_id: game.id,
      player_id: gp.playerId,
      round_number: i + 1,
      bid: rs.bid,
      tricks: rs.tricks,
      bonus: rs.bonus,
      bonus_details: rs.bonusDetails,
      score: rs.score,
    }))
  )

  if (roundScores.length > 0) {
    await supabase.from('round_scores').upsert(roundScores, {
      onConflict: 'game_id,player_id,round_number',
    })
  }
}

export async function deleteGame(id: string): Promise<void> {
  if (_guestMode) return guestStorage.deleteGame(id)
  await supabase.from('games').delete().eq('id', id)
}
