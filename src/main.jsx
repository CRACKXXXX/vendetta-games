import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import VendettaGames from './components/VendettaGames/VendettaGames.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VendettaGames />
  </StrictMode>,
)
