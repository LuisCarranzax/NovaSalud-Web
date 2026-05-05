import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
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

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-farmablue-dark text-white flex flex-col shadow-xl flex-shrink-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Perfil del Usuario / Cabecera Sidebar */}
                <div className="p-6 border-b border-farmablue-dark/50 bg-black/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-farmablue-light flex items-center justify-center text-farmablue-dark">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-light text-farmablue-light">Bienvenido,</p>
                            <p className="font-semibold tracking-wide">Administrador</p>
                        </div>
                    </div>
                    <button 
                        className="lg:hidden text-white/70 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
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

                    <NavLink 
                        to="/exportar" 
                        onClick={() => setIsSidebarOpen(false)}
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-farmablue text-white' : 'hover:bg-white/10 text-slate-300'}`}
                    >
                        <FileDown size={20} />
                        <span>Reportes y Exportación</span>
                    </NavLink>
                </nav>

                {/* Botón de Cerrar Sesión */}
                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
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
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet /> {/* Aquí se renderizarán las páginas (Inicio, Inventario, etc.) */}
                </main>
            </div>
            
            <Toaster position="top-center" />
        </div>
    );
};

export default MainLayout;