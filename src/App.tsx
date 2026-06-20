import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { SidebarLayout, SidebarInset, EasySidebar, SidebarTrigger } from '@btcv/ui/Sidebar'
import { ThemeToggle } from '@btcv/ui/DarkMode'
import { Home, Users, Gamepad2 } from 'lucide-react'
import AnimatedBackground from './components/AnimatedBackground'
import BackgroundPicker, { useBackground } from './components/BackgroundPicker'
import Dashboard from './pages/Dashboard'
import NewGame from './pages/NewGame'
import GamePlay from './pages/GamePlay'
import GameResults from './pages/GameResults'
import Players from './pages/Players'
import PlayerDetail from './pages/PlayerDetail'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bg, setBg] = useBackground()

  const getActive = () => {
    if (location.pathname.startsWith('/games/new')) return 'new'
    if (location.pathname.startsWith('/games')) return 'new'
    if (location.pathname.startsWith('/players')) return 'players'
    return 'home'
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBackground bg={bg} />
      <div className="relative z-10">
        <SidebarLayout navbarHeight={0}>
          <EasySidebar
            navbarHeight={0}
            header={
              <div className="flex items-center gap-3 px-2">
                <img src="/logo.png" alt="Skull King" className="w-8 h-8" />
                <span className="font-bold text-lg">SKULL <span className="text-primary">KING</span></span>
              </div>
            }
            footer={
              <div className="flex items-center gap-1 px-2">
                <ThemeToggle size="sm" />
                <BackgroundPicker value={bg} onChange={setBg} />
              </div>
            }
            items={[
              { key: 'home', label: 'Accueil', icon: Home, active: getActive() === 'home' },
              { key: 'new', label: 'Nouvelle Partie', icon: Gamepad2, active: getActive() === 'new' },
              { key: 'players', label: 'Joueurs', icon: Users, active: getActive() === 'players' },
            ]}
            onNavigate={(key) => {
              const routes: Record<string, string> = { home: '/', new: '/games/new', players: '/players' }
              navigate(routes[key] || '/')
            }}
          />
          <SidebarInset navbarHeight={0}>
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
