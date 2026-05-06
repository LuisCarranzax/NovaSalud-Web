import { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    PackageSearch, 
    FileDown, 
    LogOut, 
    User,
    Menu,
    X,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontWeight: '500', color: '#1e293b' }}>
                    ¿Estás seguro que deseas cerrar sesión?
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id); // Cerramos la alerta
                            logout();            // Limpiamos el contexto y localStorage
                            navigate('/login');  // Redirigimos al Login
                        }}
                        style={{ background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                    >
                        Sí, salir
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)} // Solo cerramos la alerta
                        style={{ background: '#e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { 
            duration: 5000, // La alerta dura 5 segundos antes de desaparecer sola
            position: 'top-center'
        });
    };

    return (
       <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-farmablue-dark text-white flex flex-col">
                {/* Perfil del Usuario / Cabecera Sidebar */}
                <div className="p-6 border-b border-farmablue-dark/50 bg-black/10 flex flex-col items-center justify-center text-center relative">
                    <button 
                        className="absolute top-4 right-4 lg:hidden text-white/70 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-farmablue-light flex items-center justify-center text-farmablue-dark mb-3">
                        <User size={32} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>Nova Salud</h2>
                        <p style={{ color: '#e0f2fe', fontSize: '1rem', margin: 0 }}>
                            Bienvenido, {user?.nombre || 'Usuario'}
                        </p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavLink 
                        to="/" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-farmablue text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Inicio</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/inventario" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-farmablue text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    >
                        <PackageSearch size={20} />
                        <span>Gestión de Productos</span>
                    </NavLink>
                    <NavLink 
                        to="/ventas" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-farmablue text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    >
                        <ShoppingCart size={20} />
                        <span>Punto de Venta</span>
                    </NavLink>

                    <NavLink 
                        to="/resumen-ventas" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-farmablue text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    >
                        <TrendingUp size={20} />
                        <span>Resumen de Ventas</span>
                    </NavLink>
                </nav>

                {/* Botón de Cerrar Sesión */}
                <div className="mt-auto p-4 border-t border-slate-700">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Área de Contenido Principal y Header Móvil */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Móvil */}
                <header className="lg:hidden bg-farmablue-dark text-white p-4 flex items-center justify-between shadow-md flex-shrink-0">
                    <div className="font-semibold text-lg tracking-wide">Nova Salud</div>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Contenido Principal */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet /> {/* Aquí se renderizarán las páginas (Inicio, Inventario, etc.) */}
                </main>
            </div>
            
            <Toaster position="top-center" />
        </div>
    );
};

export default MainLayout;