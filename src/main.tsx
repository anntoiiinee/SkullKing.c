import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@btcv/ui/Toast'
import { AuthProvider } from './lib/auth'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastProvider />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
