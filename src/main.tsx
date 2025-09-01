import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Import Prism.js JSON grammar globally
import 'prismjs/components/prism-json'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/webtool">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
