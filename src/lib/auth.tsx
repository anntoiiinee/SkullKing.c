import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

type AuthContext = {
  user: User | null
  session: Session | null
  isGuest: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signInAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthCtx = createContext<AuthContext>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const signInAsGuest = () => {
    setIsGuest(true)
  }

  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider value={{ user, session, isGuest, loading, signIn, signInAsGuest, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
