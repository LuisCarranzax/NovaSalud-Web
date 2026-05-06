import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory'; 
import ExportData from './pages/ExportData';
import POS from './pages/POS';
import SalesSummary from './pages/SalesSummary';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UpdatePassword from './pages/auth/UpdatePassword';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Protegemos las rutas principales para que solo usuarios logueados puedan entrar
const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas de Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Rutas Privadas (Requieren sesión) */}
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="exportar" element={<ExportData />} />
            <Route path="ventas" element={<POS />} />
            <Route path="resumen-ventas" element={<SalesSummary />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;