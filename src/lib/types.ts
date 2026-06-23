export type BonusType =
  | 'pirate_captured'
  | 'sk_captured'
  | 'mermaid_captured'
  | 'fourteen_black'
  | 'fourteen_color'
  | 'tigresse_pirate'
  | 'butin'

export type BonusDetail = {
  type: BonusType
  count: number
}

export type RoundScore = {
  bid: number
  tricks: number
  bonus: number
  bonusDetails: BonusDetail[]
  score: number
}

export type GamePlayer = {
  playerId: string
  rounds: RoundScore[]
  totalScore: number
}

export type Game = {
  id: string
  players: GamePlayer[]
  currentRound: number
  status: 'in_progress' | 'completed'
  createdAt: number
  completedAt?: number
}

export type Player = {
  id: string
  name: string
  createdAt: number
}

export const BONUS_LABELS: Record<BonusType, { label: string; points: number }> = {
  pirate_captured: { label: 'Pirate capturé (par SK)', points: 30 },
  sk_captured: { label: 'Skull King capturé (par Sirène)', points: 40 },
  mermaid_captured: { label: 'Sirène capturée (par Pirate)', points: 20 },
  fourteen_black: { label: '14 Noir capturé', points: 20 },
  fourteen_color: { label: '14 Couleur capturé', points: 10 },
  tigresse_pirate: { label: 'Tigresse (mode pirate)', points: 20 },
  butin: { label: 'Butin capturé', points: 20 },
}
