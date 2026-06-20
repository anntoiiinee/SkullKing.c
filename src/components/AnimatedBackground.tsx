import { lazy, Suspense } from 'react'
import type { BgKey } from './BackgroundPicker'

const Waves = lazy(() => import('@btcv/ui/backgrounds/Waves'))
const Aurora = lazy(() => import('@btcv/ui/backgrounds/Aurora'))
const Particles = lazy(() => import('@btcv/ui/backgrounds/Particles'))
const Squares = lazy(() => import('@btcv/ui/backgrounds/Squares'))
const Threads = lazy(() => import('@btcv/ui/backgrounds/Threads'))

export default function AnimatedBackground({ bg }: { bg: BgKey }) {
  if (bg === 'none') return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
      <Suspense fallback={null}>
        {bg === 'waves' && (
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
        )}
        {bg === 'aurora' && (
          <Aurora
            colorStops={['#E7BB1D', '#d4a017', '#b8860b', '#8B6914']}
            amplitude={1.2}
            blend={0.6}
            speed={0.5}
          />
        )}
        {bg === 'particles' && (
          <Particles
            particleCount={200}
            particleSpread={10}
            speed={0.3}
            particleColors={['#E7BB1D', '#d4a017', '#F5F0E8']}
            moveParticlesOnHover
            particleBaseSize={1.5}
            alphaParticles
          />
        )}
        {bg === 'squares' && (
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="var(--primary)"
            squareSize={40}
            hoverFillColor="rgba(231, 187, 29, 0.15)"
          />
        )}
        {bg === 'threads' && (
          <Threads
            color={[231, 187, 29]}
            amplitude={2}
            distance={0}
            enableMouseInteraction
          />
        )}
      </Suspense>
    </div>
  )
}
