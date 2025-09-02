import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import Home from './pages/Home'
import JSONFormatter from './pages/JSONFormatter'
import JSONValidator from './pages/JSONValidator'
import JSONTreeView from './pages/JSONTreeView'
import JWTDecoder from './pages/JWTDecoder'
import RegexTester from './pages/RegexTester'
import RegexGuide from './pages/RegexGuide'
import JSONGuide from './pages/JSONGuide'
import ColorPicker from './pages/ColorPicker'

import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/validator" element={<JSONValidator />} />
          <Route path="/tree-view" element={<JSONTreeView />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
          <Route path="/regex" element={<RegexTester />} />
          <Route path="/regex-guide" element={<RegexGuide />} />
          <Route path="/json-guide" element={<JSONGuide />} />
          <Route path="/color-picker" element={<ColorPicker />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
