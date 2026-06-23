import { BonusDetail, BONUS_LABELS, RoundScore } from './types'

export function calculateBonus(details: BonusDetail[]): number {
  return details
    .filter(d => d.type !== 'butin')
    .reduce((sum, d) => sum + d.count * BONUS_LABELS[d.type].points, 0)
}

export function calculateRoundScore(
  roundNumber: number,
  bid: number,
  tricks: number,
  bonusDetails: BonusDetail[]
): RoundScore {
  const bonus = calculateBonus(bonusDetails)
  let score: number

  if (bid === 0) {
    score = tricks === 0 ? roundNumber * 10 : -(roundNumber * 10)
  } else if (bid === tricks) {
    score = 20 * bid + bonus
  } else {
    score = -10 * Math.abs(bid - tricks)
  }

  return { bid, tricks, bonus, bonusDetails, score }
}

export function resolveButinBonus(
  entries: Record<string, { bid: number; tricks: number; bonusDetails: BonusDetail[] }>
): Record<string, number> {
  const adjustments: Record<string, number> = {}

  for (const [playerId, entry] of Object.entries(entries)) {
    const butin = entry.bonusDetails.find(d => d.type === 'butin')
    if (!butin || !butin.linkedPlayerId) continue

    const linkedEntry = entries[butin.linkedPlayerId]
    if (!linkedEntry) continue

    const playerSucceeded = entry.bid === entry.tricks
    const linkedSucceeded = linkedEntry.bid === linkedEntry.tricks

    let butinValue = 0
    if (playerSucceeded && linkedSucceeded) {
      butinValue = 20 * butin.count
    } else if (!playerSucceeded && !linkedSucceeded) {
      butinValue = -20 * butin.count
    }

    adjustments[playerId] = (adjustments[playerId] || 0) + butinValue
  }

  return adjustments
}
