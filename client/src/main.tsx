import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n' // Import i18n configuration first
import App from './App.tsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)