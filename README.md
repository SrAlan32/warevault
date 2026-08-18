# WareVault

Aplicación web para la gestión de inventario: control de productos, entradas y salidas de
mercancía, alertas de stock mínimo, reportes e historial de movimientos.

## Tecnologías

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express (API REST) |
| Base de datos | Prisma ORM + SQLite |
| Autenticación | JWT + bcrypt |
| Pruebas E2E | Selenium WebDriver + pytest (Python) |

## Estructura del repositorio

```
ProyectoInventario/
├── docs/                 # Documentación (estrategia, scrum, plan de pruebas)
├── backend/              # API REST (Express + Prisma)
├── frontend/             # Aplicación web (React + TypeScript)
├── tests/                # Pruebas automatizadas con Selenium
└── README.md
```

## Requisitos previos

- Node.js 18 o superior
- Python 3 con `selenium`, `pytest` y `pytest-html`
- Google Chrome (para las pruebas Selenium)

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init   # crea la BD y ejecuta el seed
npm run dev                          # API en http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                          # App en http://localhost:5173
```

### 3. Pruebas automatizadas (Selenium)

Con backend y frontend corriendo:

```bash
cd tests
python -m pytest                     # ejecuta los 13 casos de prueba
```

- Reporte HTML: `tests/evidencias/reporte_test.html`
- Capturas de los módulos: `tests/evidencias/*.png`
- Regenerar evidencias: `python evidencias/capturas_demo.py`

Para más informacion sobre las pruebas visite:
- [Plan de pruebas](docs/plan_pruebas.md)

## Usuarios de demostración

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| Administrador | admin@warevault.com | Admin123! |
| Almacenero | almacenero@warevault.com | Almacen123! |

## Funcionalidades

- Login con JWT y control de roles (Admin / Almacenero)
- CRUD de productos con categorías, precios y stock
- Entradas y salidas de mercancía con validación de stock
- Dashboard con indicadores del inventario
- Reporte de bajo stock con exportación a CSV
- Historial de movimientos por producto
- Gestión de usuarios (solo Administrador)
