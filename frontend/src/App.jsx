import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory'; 
import ExportData from './pages/ExportData'; // <-- Añadido
import POS from './pages/POS';
import SalesSummary from './pages/SalesSummary';
// Dentro de <Routes>:

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="exportar" element={<ExportData />} />
          <Route path="ventas" element={<POS />} />
          <Route path="resumen-ventas" element={<SalesSummary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;