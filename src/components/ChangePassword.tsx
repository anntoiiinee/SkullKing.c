import { useState } from 'react'
import { Button } from '@btcv/ui/Button'
import { Input } from '@btcv/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { Alert } from '@btcv/ui/Alert'
import { toast } from '@btcv/ui/Toast'
import { supabase } from '../lib/supabase'
import { KeyRound, X } from 'lucide-react'

type Props = {
  onClose: () => void
}

export default function ChangePassword({ onClose }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    toast.success('Mot de passe modifié')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Changer le mot de passe
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error" title="Erreur">{error}</Alert>}
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirmer"
              type="password"
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              required
            />
            <Button variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
