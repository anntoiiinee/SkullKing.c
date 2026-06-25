import { useState } from 'react'
import { Button } from '@btcv/ui/Button'
import { Input } from '@btcv/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@btcv/ui/Card'
import { Alert } from '@btcv/ui/Alert'
import { useAuth } from '../lib/auth'
import { UserRound } from 'lucide-react'

export default function Login() {
  const { signIn, signInAsGuest } = useAuth()
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
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={signInAsGuest}>
            <UserRound className="w-4 h-4" /> Mode invité
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Les scores ne seront pas sauvegardés
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
