# Nova Salud - Sistema de Farmacia Digital

Nova Salud es una aplicación web integral diseñada para gestionar el inventario, ventas y administración general de una farmacia. Está construida utilizando el stack MERN (MongoDB, Express, React, Node.js) y ofrece una interfaz moderna, rápida y segura.

## 🚀 Características Principales

- **Gestión de Autenticación y Perfiles:** Registro, inicio de sesión seguro mediante JWT, y recuperación de contraseñas.
- **Punto de Venta (POS):** Carrito de compras intuitivo, procesamiento de ventas (efectivo/tarjeta) y reducción dinámica de stock según la presentación (Caja, Blíster, Unidad).
- **Control de Inventario:** CRUD completo de productos con indicadores de stock crítico (semáforo), control de fechas de vencimiento y abastecimiento.
- **Dashboard Gerencial:** Resumen en tiempo real de ingresos, productos bajos en stock y "Activity Feed" de los últimos movimientos del sistema.
- **Reportes de Exportación:** Generación en un clic de reportes en formato **PDF** y **Excel** de inventario y cuadre de caja (ventas).

## 📁 Estructura del Proyecto

El proyecto está estructurado como un monorepo que separa el lado del servidor y del cliente en dos carpetas principales:

```text
NovaSalud-Web/
│
├── backend/                  # API REST con Node.js y Express
│   ├── config/               # Configuración de conexión a base de datos (MongoDB)
│   ├── controllers/          # Lógica principal (authController, productController, saleController)
│   ├── models/               # Modelos de datos de Mongoose (User, Products, Sale)
│   ├── routes/               # Rutas API (Endpoints de auth, products, sales)
│   ├── server.js             # Punto de entrada principal del backend
│   └── dockerfile            # Configuración Docker para el servidor
│
├── frontend/                 # Aplicación Cliente con React y Vite
│   ├── public/               # Assets estáticos y favicon
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (MainLayout, ProtectedRoute)
│   │   ├── context/          # Contexto global (AuthContext para manejo de sesión)
│   │   ├── css/              # Estilos modulares Vanilla CSS organizados por página
│   │   ├── hooks/            # Custom Hooks para abstraer lógica (usePOS, useInventory, etc.)
│   │   ├── pages/            # Vistas principales (Login, Dashboard, POS, Inventory, etc.)
│   │   ├── services/         # Configuración de Axios (api.js)
│   │   ├── utils/            # Funciones utilitarias (ejs. validador de contraseña)
│   │   ├── App.jsx           # Configuración de React Router
│   │   └── main.jsx          # Punto de arranque de React
│   └── dockerfile            # Configuración Docker para el cliente
│
├── docker-compose.yml        # Orquestación de contenedores (Frontend, Backend, MongoDB)
└── package.json              # Scripts concurrentes para levantar ambos entornos localmente
```

## 💻 Instalación y Configuración (Desarrollo Local)

Para ejecutar este proyecto en tu entorno local sin usar Docker, sigue estos pasos:

### 1. Requisitos Previos
- Tener instalado **Node.js** (v18+ recomendado).
- Tener instalado y en ejecución **MongoDB** localmente (o tener una URL de MongoDB Atlas).

### 2. Instalar Dependencias

Abre tu terminal en la raíz del proyecto (`NovaSalud-Web/`) y ejecuta los siguientes comandos para instalar los módulos del entorno global, backend y frontend:

```bash
# 1. Instalar dependencias raíz (concurrently)
npm install

# 2. Instalar dependencias del Backend
cd backend
npm install

# 3. Instalar dependencias del Frontend
cd ../frontend
npm install

# Volver a la raíz del proyecto
cd ..
```

### 3. Configuración de Variables de Entorno

Debes crear un archivo `.env` dentro de la carpeta `backend/`. En la terminal:
```bash
cd backend
touch .env
```

Agrega el siguiente contenido al archivo `backend/.env` (reemplaza los valores si es necesario):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/NovaSaludDB
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
```

### 4. Ejecutar el Proyecto

Desde la **raíz del proyecto (`NovaSalud-Web/`)**, puedes iniciar simultáneamente el Backend y el Frontend usando el script preconfigurado:

```bash
npm run dev
```

Este comando iniciará:
- El servidor Node.js en `http://localhost:5000`
- La aplicación React/Vite en `http://localhost:5173`

> Si deseas ejecutarlos por separado, puedes usar `npm run dev:backend` y `npm run dev:frontend` desde la raíz.

---

## 🐳 Despliegue con Docker (Opcional)

Si prefieres usar contenedores, el proyecto incluye una configuración completa de Docker Compose que levanta la Base de Datos, el Backend y el Frontend automáticamente de forma aislada.

Solo necesitas tener **Docker** y **Docker Compose** instalados y ejecutar en la raíz del proyecto:

```bash
docker-compose up --build
```
- La web estará disponible en `http://localhost:5173`
- La API en `http://localhost:5000`
- Base de datos MongoDB mapeada en el puerto `27017`

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router Dom, jsPDF, ExcelJS.
- **Backend:** Node.js, Express, Mongoose, JWT (JSON Web Tokens), bcrypt.
- **Base de Datos:** MongoDB.
- **Herramientas Adicionales:** Docker, Concurrently, ESLint.
