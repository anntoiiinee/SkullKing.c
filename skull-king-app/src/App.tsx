import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { SidebarLayout, SidebarInset, EasySidebar, SidebarTrigger } from '@btcv/ui/Sidebar'
import { ThemeToggle } from '@btcv/ui/DarkMode'
import { Skull, Home, Users, Gamepad2 } from 'lucide-react'
import Waves from '@btcv/ui/backgrounds/Waves'
import Dashboard from './pages/Dashboard'
import NewGame from './pages/NewGame'
import GamePlay from './pages/GamePlay'
import GameResults from './pages/GameResults'
import Players from './pages/Players'
import PlayerDetail from './pages/PlayerDetail'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const getActive = () => {
    if (location.pathname.startsWith('/games/new')) return 'new'
    if (location.pathname.startsWith('/games')) return 'new'
    if (location.pathname.startsWith('/players')) return 'players'
    return 'home'
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <Waves
          lineColor="var(--primary)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          xGap={12}
          yGap={36}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
        />
      </div>
      <div className="relative z-10">
        <SidebarLayout>
          <EasySidebar
            header={
              <div className="flex items-center gap-2 px-2">
                <Skull className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">SKULL <span className="text-primary">KING</span></span>
              </div>
            }
            footer={<div className="px-2"><ThemeToggle size="sm" /></div>}
            items={[
              { key: 'home', label: 'Accueil', icon: Home, active: getActive() === 'home' },
              { key: 'new', label: 'Nouvelle Partie', icon: Gamepad2, active: getActive() === 'new' },
              { key: 'players', label: 'Joueurs', icon: Users, active: getActive() === 'players' },
            ]}
            onItemClick={(item) => {
              const routes: Record<string, string> = { home: '/', new: '/games/new', players: '/players' }
              navigate(routes[item.key] || '/')
            }}
          />
          <SidebarInset>
            <header className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <SidebarTrigger />
            </header>
            <main className="max-w-6xl mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/games/new" element={<NewGame />} />
                <Route path="/games/:id" element={<GamePlay />} />
                <Route path="/games/:id/results" element={<GameResults />} />
                <Route path="/players" element={<Players />} />
                <Route path="/players/:id" element={<PlayerDetail />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default App
