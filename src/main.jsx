import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppState  from './context/app/appState.jsx';
import './app.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppState>
      <App />
    </AppState>
  </StrictMode>,
)
