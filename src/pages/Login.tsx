import { useState } from 'react'
import { Button } from '@btcv/ui/Button'
import { Input } from '@btcv/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { Alert } from '@btcv/ui/Alert'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) setError(err)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">☠️</span>
              <span className="font-bold text-xl">SKULL <span className="text-primary">KING</span></span>
            </div>
            <p className="text-sm text-muted-foreground font-normal">Connectez-vous pour continuer</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error" title="Erreur">{error}</Alert>}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <Button variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
