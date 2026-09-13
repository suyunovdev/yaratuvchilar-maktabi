import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dars from './pages/Dars.jsx'
import ReactKurs from './pages/ReactKurs.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dars/:k" element={<Dars />} />
      <Route path="/react-kurs" element={<ReactKurs />} />
    </Routes>
  </BrowserRouter>
)
