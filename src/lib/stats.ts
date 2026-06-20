import { Game, Player } from './types'

export type PlayerStats = {
  player: Player
  gamesPlayed: number
  wins: number
  winRate: number
  avgScore: number
  bestScore: number
  worstScore: number
  totalBids: number
  correctBids: number
  bidAccuracy: number
  currentWinStreak: number
  avgScoreByRound: number[]
  scoreHistory: { gameIndex: number; score: number; date: number }[]
}

export function getPlayerStats(player: Player, allGames: Game[]): PlayerStats {
  const completedGames = allGames.filter(
    g => g.status === 'completed' && g.players.some(p => p.playerId === player.id)
  )

  if (completedGames.length === 0) {
    return {
      player,
      gamesPlayed: 0,
      wins: 0,
      winRate: 0,
      avgScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalBids: 0,
      correctBids: 0,
      bidAccuracy: 0,
      currentWinStreak: 0,
      avgScoreByRound: [],
      scoreHistory: [],
    }
  }

  const playerScores = completedGames.map(g => {
    const gp = g.players.find(p => p.playerId === player.id)!
    return { game: g, gp }
  })

  const scores = playerScores.map(ps => ps.gp.totalScore)
  const wins = playerScores.filter(ps => {
    const maxScore = Math.max(...ps.game.players.map(p => p.totalScore))
    return ps.gp.totalScore === maxScore
  }).length

  let totalBids = 0
  let correctBids = 0
  const roundScoreSums: number[] = Array(10).fill(0)
  const roundCounts: number[] = Array(10).fill(0)

  for (const ps of playerScores) {
    for (let i = 0; i < ps.gp.rounds.length; i++) {
      const r = ps.gp.rounds[i]
      totalBids++
      if (r.bid === r.tricks) correctBids++
      roundScoreSums[i] += r.score
      roundCounts[i]++
    }
  }

  const avgScoreByRound = roundScoreSums.map((sum, i) =>
    roundCounts[i] > 0 ? Math.round(sum / roundCounts[i]) : 0
  )

  let currentWinStreak = 0
  for (let i = playerScores.length - 1; i >= 0; i--) {
    const ps = playerScores[i]
    const maxScore = Math.max(...ps.game.players.map(p => p.totalScore))
    if (ps.gp.totalScore === maxScore) currentWinStreak++
    else break
  }

  const scoreHistory = playerScores.map((ps, i) => ({
    gameIndex: i + 1,
    score: ps.gp.totalScore,
    date: ps.game.completedAt || ps.game.createdAt,
  }))

  return {
    player,
    gamesPlayed: completedGames.length,
    wins,
    winRate: Math.round((wins / completedGames.length) * 100),
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    totalBids,
    correctBids,
    bidAccuracy: totalBids > 0 ? Math.round((correctBids / totalBids) * 100) : 0,
    currentWinStreak,
    avgScoreByRound,
    scoreHistory,
  }
}
