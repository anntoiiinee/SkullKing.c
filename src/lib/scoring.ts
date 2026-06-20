import { BonusDetail, BONUS_LABELS, RoundScore } from './types'

export function calculateBonus(details: BonusDetail[]): number {
  return details.reduce((sum, d) => sum + d.count * BONUS_LABELS[d.type].points, 0)
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
