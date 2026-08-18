# 3. Plan de Pruebas

---

## 3.1 Requerimientos funcionales y no funcionales relacionados con las historias

| Req | Descripción | Historia asociada |
| :--- | :--- | :--- |
| RF01 | Registro de usuarios con roles | HU10 |
| RF02 | Autenticación mediante JWT | HU10 |
| RF03 | CRUD de productos | HU1, HU2, HU3 |
| RF04 | Registro de entradas y salidas de mercancía | HU4, HU5 |
| RF05 | Cálculo de stock en tiempo real | HU4, HU5, HU7 |
| RF06 | Alertas de stock mínimo | HU6, HU8 |
| RF07 | Reporte de bajo stock con exportación CSV | HU8 |
| RF08 | Historial de movimientos por producto | HU9 |

| Req | Descripción | Historia asociada |
| :--- | :--- | :--- |
| RNF01 | Tiempo de respuesta < 2 s | Todas |
| RNF02 | Interfaz responsiva | Todas |
| RNF03 | Contraseñas encriptadas | HU10 |
| RNF04 | Validación en frontend y backend | HU1, HU4, HU5 |
| RNF05 | Control de acceso por roles | HU10 |
| RNF06 | Manejo de errores con códigos HTTP | Todas |

## 3.2 Criterios de aceptación y rechazo de pruebas

| Criterio | Aceptación | Rechazo |
| :--- | :--- | :--- |
| Funcionalidad | La acción se ejecuta según los criterios de aceptación de la historia | Cualquier desviación del comportamiento esperado |
| Validaciones | El sistema bloquea datos inválidos con mensaje claro | El sistema acepta datos inválidos (ej. cantidad <= 0) |
| Integridad de datos | El stock mostrado coincide con la suma de movimientos | Discrepancia entre stock mostrado y movimientos |
| Control de acceso | El Almacenero no accede a funciones de Admin | Acceso no autorizado a módulos restringidos |
| UI/UX | Elementos visibles, clicables y mensajes correctos | Elementos superpuestos o mensajes ambiguos |
| Rendimiento | Carga de páginas < 2 s | Carga superior a 2 s |

## 3.3 Herramientas de pruebas

| Herramienta | Uso | Justificación |
| :--- | :--- | :--- |
| Selenium WebDriver (Python) | Automatización E2E en navegador | Estándar industrial y herramienta usada en la materia |
| pytest | Orquestador y framework de pruebas | Integración nativa con Selenium, reportes detallados |
| pytest-html | Generación de reporte HTML de resultados | Evidencia visual del plan 3.8 |
| Chrome DevTools | Inspección de elementos y selectores | Ayuda a identificar localizadores (ID, CSS, XPath) |
| Selenium Manager | Gestión automática del driver de Chrome | Evita configurar drivers manualmente |
| Postman | Pruebas manuales de la API (opcional) | Verificación rápida de endpoints |

## 3.4 Cronograma de ejecución de pruebas

| Semana | Tipo | Actividad | Responsable |
| :--- | :--- | :--- | :--- |
| 03/08 - 04/08 | Manual | Pruebas de humo sobre CRUD de productos y login | Alan Bertrand |
| 05/08 - 06/08 | Automatizada | Desarrollo de casos Selenium (Page Object Model) | Alan Bertrand |
| 07/08 - 08/08 | Automatizada | Ejecución completa y corrección de bugs | Alan Bertrand |
| 09/08 - 10/08 | Manual + Auto | Pruebas de regresión finales y demo | Alan Bertrand |

---

## 3.5 Plantillas para casos de prueba

### Plantilla general (formato estándar)

Cada caso de prueba se documenta utilizando el siguiente formato para asegurar trazabilidad,
consistencia y facilidad de reproducibilidad:

| Campo | Descripción |
| :--- | :--- |
| **ID** | Identificador único del caso de prueba (CP-XXX) |
| **Módulo** | Módulo del sistema que se está probando |
| **Historia asociada** | Historia de usuario a la que responde |
| **Prioridad** | Alta / Media / Baja |
| **Tipo de prueba** | Funcional / Validación / Seguridad / Negocio |
| **Título** | Nombre descriptivo del caso |
| **Precondiciones** | Estado del sistema necesario antes de ejecutar el caso |
| **Pasos** | Secuencia numerada de acciones a realizar |
| **Datos de prueba** | Datos específicos que se ingresan en cada paso |
| **Resultado esperado** | Comportamiento que el sistema debe mostrar |
| **Resultado obtenido** | Lo que realmente ocurrió al ejecutar |
| **Veredicto** | PASÓ / FALLÓ / BLOQUEADO |
| **Ejecutado por** | Nombre del tester |
| **Fecha de ejecución** | Fecha y hora |
| **Evidencia** | Captura de pantalla, video o log |
| **Bug asociado** | ID del bug registrado (si FALLÓ) |
| **Observaciones** | Notas adicionales |

### Plantilla vacía (copiar para nuevos casos)

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    CASO DE PRUEBA — CP-XXX                             ║
╠══════════════════════════════════════════════════════════════════════════╣
║ Módulo:                    ________________________________________    ║
║ Historia asociada:         ________________________________________    ║
║ Prioridad:                 [ ] Alta  [ ] Media  [ ] Baja              ║
║ Tipo de prueba:            [ ] Funcional  [ ] Validación              ║
║                            [ ] Seguridad  [ ] Negocio                 ║
║ Título:                    ________________________________________    ║
╠══════════════════════════════════════════════════════════════════════════╣
║ PRECONDICIONES                                                        ║
║ 1. ________________________________________________________________    ║
║ 2. ________________________________________________________________    ║
╠══════════════════════════════════════════════════════════════════════════╣
║ PASOS DE EJECUCIÓN                      DATOS DE PRUEBA               ║
║ 1. ____________________________________  ____________________________  ║
║ 2. ____________________________________  ____________________________  ║
║ 3. ____________________________________  ____________________________  ║
║ 4. ____________________________________  ____________________________  ║
╠══════════════════════════════════════════════════════════════════════════╣
║ RESULTADO ESPERADO:                                                   ║
║ ___________________________________________________________________    ║
║ ___________________________________________________________________    ║
╠══════════════════════════════════════════════════════════════════════════╣
║ RESULTADO OBTENIDO:                                                   ║
║ ___________________________________________________________________    ║
╠══════════════════════════════════════════════════════════════════════════╣
║ VEREDICTO:          [ ] PASO   [ ] FALLO   [ ] BLOQUEADO             ║
║ Ejecutado por:      ____________________  Fecha: _______________      ║
║ Evidencia:          Captura: ____________  Video: _______________      ║
║ Bug asociado:       _________________  (si aplica)                     ║
║ Observaciones:      _____________________________________________     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### Casos de prueba documentados — Módulo de Login (HU10)

#### CP-001 — Inicio de sesión exitoso con credenciales válidas (Admin)

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-001 |
| **Módulo** | Autenticación / Login |
| **Historia** | HU10 — Gestionar usuarios y sus roles |
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Título** | Iniciar sesión exitosamente con credenciales de Administrador |

**Precondiciones:**
1. El navegador está abierto en la URL del sistema (http://localhost:5173).
2. El usuario existe en la base de datos con rol Admin.
3. El usuario no tiene sesión activa.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la página de login | URL: http://localhost:5173/login | Se muestra el formulario con campos email y contraseña |
| 2 | Ingresar el correo electrónico | admin@warevault.com | El campo acepta el texto |
| 3 | Ingresar la contraseña | Admin123! | El campo muestra asteriscos |
| 4 | Clic en "Ingresar" | — | Se redirige al Dashboard |
| 5 | Verificar el Dashboard | — | Se muestra "Dashboard", el sidebar y el nombre del usuario |

| **Resultado obtenido:** | El sistema redirige al Dashboard y muestra los datos del usuario Admin. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/01_dashboard.png |

---

#### CP-002 — Inicio de sesión con credenciales inválidas

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-002 |
| **Módulo** | Autenticación / Login |
| **Historia** | HU10 |
| **Prioridad** | Alta |
| **Tipo** | Validación / Seguridad |
| **Título** | Rechazar acceso con contraseña incorrecta |

**Precondiciones:**
1. El navegador está abierto en la página de login.
2. El usuario admin@warevault.com existe.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la página de login | URL: http://localhost:5173/login | Se muestra el formulario |
| 2 | Ingresar el correo electrónico | admin@warevault.com | — |
| 3 | Ingresar una contraseña incorrecta | clave-incorrecta | — |
| 4 | Clic en "Ingresar" | — | Se muestra un mensaje de error |

| **Resultado obtenido:** | Se muestra el mensaje "Credenciales inválidas" y el usuario no accede al Dashboard. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

#### CP-003 — Inicio de sesión exitoso con rol Almacenero

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-003 |
| **Módulo** | Autenticación / Login |
| **Historia** | HU10 |
| **Prioridad** | Media |
| **Tipo** | Funcional |
| **Título** | Iniciar sesión exitosamente con credenciales de Almacenero |

**Precondiciones:**
1. El navegador está en la página de login.
2. El usuario almacenero@warevault.com existe con rol Almacenero.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la página de login | URL: http://localhost:5173/login | Se muestra el formulario |
| 2 | Ingresar el correo electrónico | almacenero@warevault.com | — |
| 3 | Ingresar la contraseña | Almacen123! | — |
| 4 | Clic en "Ingresar" | — | Se redirige al Dashboard |

| **Resultado obtenido:** | El sistema redirige al Dashboard. Se muestra el rol "ALMACENERO" en el sidebar. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

### Casos de prueba documentados — Módulo de Productos (HU1, HU2, HU3)

#### CP-004 — Crear un nuevo producto con datos válidos

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-004 |
| **Módulo** | Productos |
| **Historia** | HU1 — Registrar un nuevo producto |
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Título** | Crear un producto nuevo con todos los campos obligatorios |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Se encuentra en la sección de Productos.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Clic en "+ Nuevo producto" | — | Se abre un modal con el formulario |
| 2 | Ingresar SKU | TST-DEMO | El campo acepta el valor |
| 3 | Ingresar nombre | "Cable HDMI" | — |
| 4 | Seleccionar categoría | Electrónica | Se muestra la selección |
| 5 | Ingresar precio de compra | 10 | — |
| 6 | Ingresar precio de venta | 25 | — |
| 7 | Ingresar stock mínimo | 2 | — |
| 8 | Ingresar stock inicial | 0 | — |
| 9 | Clic en "Crear producto" | — | Se cierra el modal, se muestra mensaje de éxito |

| **Resultado obtenido:** | Se muestra "Producto creado correctamente" y el producto aparece en la tabla al buscarlo por SKU. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/02_productos.png |

---

#### CP-005 — Editar el nombre de un producto existente

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-005 |
| **Módulo** | Productos |
| **Historia** | HU2 — Editar la información de un producto |
| **Prioridad** | Media |
| **Tipo** | Funcional |
| **Título** | Editar el nombre de un producto y verificar que el cambio se refleje |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existe un producto con SKU "TSE-DEMO" y nombre "Producto Editar".

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Buscar el producto por SKU | TSE-DEMO | Se muestra el producto en la tabla |
| 2 | Clic en "Editar" en la fila del producto | — | Se abre el modal con los datos actuales |
| 3 | Cambiar el nombre | "Producto Editado" | — |
| 4 | Clic en "Guardar cambios" | — | Se cierra el modal, se muestra mensaje de éxito |
| 5 | Buscar de nuevo por SKU | TSE-DEMO | El nombre ahora es "Producto Editado" |

| **Resultado obtenido:** | El nombre del producto se actualiza correctamente y se refleja en la tabla. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

#### CP-006 — Eliminar un producto sin movimientos registrados

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-006 |
| **Módulo** | Productos |
| **Historia** | HU3 — Eliminar un producto del catálogo |
| **Prioridad** | Media |
| **Tipo** | Funcional |
| **Título** | Eliminar un producto que no tiene movimientos registrados |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existe un producto con SKU "TSD-DEMO" y stock 0 (sin movimientos).

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Buscar el producto por SKU | TSD-DEMO | Se muestra el producto |
| 2 | Clic en "Eliminar" en la fila | — | Se muestra un diálogo de confirmación del navegador |
| 3 | Aceptar la eliminación | — | Se muestra mensaje de éxito |
| 4 | Buscar de nuevo por SKU | TSD-DEMO | No se encuentra resultado |

| **Resultado obtenido:** | Se muestra "Producto eliminado correctamente" y el producto desaparece de la tabla. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

### Casos de prueba documentados — Módulo de Movimientos (HU4, HU5)

#### CP-007 — Registrar entrada de mercancía que incrementa el stock

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-007 |
| **Módulo** | Movimientos |
| **Historia** | HU4 — Registrar entrada de mercancía |
| **Prioridad** | Alta |
| **Tipo** | Funcional / Negocio |
| **Título** | Registrar una entrada de 5 unidades y verificar que el stock se incrementa |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existe un producto "Mov Entrada" (SKU: TME-DEMO) con stock actual = 10.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la sección "Movimientos" | — | Se muestra el formulario de movimiento |
| 2 | Seleccionar el producto | "Mov Entrada" | Se selecciona el producto |
| 3 | Seleccionar tipo "Entrada (+)" | — | El botón se resalta en verde |
| 4 | Ingresar cantidad | 5 | — |
| 5 | Ingresar nota (opcional) | "reposición de prueba" | — |
| 6 | Clic en "Registrar movimiento" | — | Se muestra mensaje de éxito |
| 7 | Navegar a Productos y buscar el SKU | TME-DEMO | El stock ahora es 15 |

| **Resultado obtenido:** | Se muestra "entrada registrado correctamente" y el stock se incrementa de 10 a 15. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/03_movimientos.png |

---

#### CP-008 — Registrar salida de mercancía que decrementa el stock

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-008 |
| **Módulo** | Movimientos |
| **Historia** | HU5 — Registrar salida de mercancía |
| **Prioridad** | Alta |
| **Tipo** | Funcional / Negocio |
| **Título** | Registrar una salida de 3 unidades y verificar que el stock se decrementa |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existe un producto "Mov Salida" (SKU: TMS-DEMO) con stock actual = 10.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la sección "Movimientos" | — | Se muestra el formulario |
| 2 | Seleccionar el producto | "Mov Salida" | Se selecciona |
| 3 | Seleccionar tipo "Salida (-)" | — | El botón se resalta en rojo |
| 4 | Ingresar cantidad | 3 | — |
| 5 | Ingresar nota | "venta de prueba" | — |
| 6 | Clic en "Registrar movimiento" | — | Se muestra mensaje de éxito |
| 7 | Navegar a Productos y buscar el SKU | TMS-DEMO | El stock ahora es 7 |

| **Resultado obtenido:** | Se muestra "salida registrado correctamente" y el stock se decrementa de 10 a 7. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

#### CP-009 — Rechazar salida superior al stock disponible

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-009 |
| **Módulo** | Movimientos |
| **Historia** | HU5 — Registrar salida de mercancía |
| **Prioridad** | Alta |
| **Tipo** | Validación / Negocio |
| **Título** | Intentar sacar más unidades de las disponibles y verificar que el sistema lo rechaza |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existe un producto "Mov Sin Stock" (SKU: TMX-DEMO) con stock actual = 10.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la sección "Movimientos" | — | Se muestra el formulario |
| 2 | Seleccionar el producto | "Mov Sin Stock" | Se selecciona |
| 3 | Seleccionar tipo "Salida (-)" | — | — |
| 4 | Ingresar cantidad | 99999 | — |
| 5 | Clic en "Registrar movimiento" | — | Se muestra mensaje de error "Stock insuficiente" |

| **Resultado obtenido:** | Se muestra "Stock insuficiente para realizar la salida". El stock NO cambia. |
| :--- | :--- |
| **Veredicto:** | PASÓ |

---

### Casos de prueba documentados — Módulo de Reportes (HU7, HU8)

#### CP-010 — Verificar que el reporte de bajo stock muestra los productos correctos

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-010 |
| **Módulo** | Reportes |
| **Historia** | HU8 — Ver un reporte de productos con bajo stock |
| **Prioridad** | Alta |
| **Tipo** | Funcional / Negocio |
| **Título** | Verificar que el reporte lista productos cuyo stock <= stock mínimo |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. Existen productos sembrados con stock menor al mínimo (Teclado USB stock=5, mínimo=8; Frijoles 2kg stock=3, mínimo=15).

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la sección "Bajo Stock" | — | Se muestra la tabla de reporte |
| 2 | Verificar que "Teclado USB" aparece | — | Aparece con stock=5 y mínimo=8 |
| 3 | Verificar que "Frijoles 2kg" aparece | — | Aparece con stock=3 y mínimo=15 |
| 4 | Verificar el botón "Exportar CSV" | — | El botón está visible y clickeable |

| **Resultado obtenido:** | Ambos productos aparecen en la tabla. El botón de exportación CSV está disponible. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/04_reporte_bajo_stock.png |

---

#### CP-011 — Verificar que el Dashboard muestra el resumen del inventario

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-011 |
| **Módulo** | Dashboard |
| **Historia** | HU7 — Ver el inventario actual |
| **Prioridad** | Media |
| **Tipo** | Funcional |
| **Título** | Verificar que el Dashboard muestra las 4 tarjetas y la tabla de últimos movimientos |

**Precondiciones:**
1. El usuario está logueado como Admin.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar al Dashboard | — | Se muestra el título "Dashboard" |
| 2 | Verificar tarjeta "Productos registrados" | — | Muestra un número > 0 |
| 3 | Verificar tarjeta "Bajo stock" | — | Muestra un número > 0 |
| 4 | Verificar tarjeta "Movimientos" | — | Muestra un número > 0 |
| 5 | Verificar tabla "Últimos movimientos" | — | Muestra filas con producto, tipo, cantidad y fecha |

| **Resultado obtenido:** | Las 4 tarjetas muestran datos y la tabla de últimos movimientos tiene registros. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/01_dashboard.png |

---

### Casos de prueba documentados — Módulo de Usuarios (HU10)

#### CP-012 — Admin crea un usuario nuevo y lo elimina

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-012 |
| **Módulo** | Usuarios |
| **Historia** | HU10 — Gestionar usuarios y sus roles |
| **Prioridad** | Alta |
| **Tipo** | Funcional / Seguridad |
| **Título** | El Administrador crea un usuario nuevo, verifica que aparece y lo elimina |

**Precondiciones:**
1. El usuario está logueado como Admin.
2. No existe un usuario con el email generado.

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Navegar a la sección "Usuarios" | — | Se muestra la tabla de usuarios |
| 2 | Clic en "+ Nuevo usuario" | — | Se abre el modal |
| 3 | Ingresar nombre | "Usuario Prueba" | — |
| 4 | Ingresar email | prueba-timestamp@warevault.com (único) | — |
| 5 | Ingresar contraseña | Clave123! | — |
| 6 | Seleccionar rol | Almacenero | — |
| 7 | Clic en "Crear usuario" | — | Se cierra el modal, se muestra éxito |
| 8 | Verificar en la tabla | Email generado | El usuario aparece en la tabla |
| 9 | Clic en "Eliminar" del usuario creado | — | Se muestra confirmación del navegador |
| 10 | Aceptar la eliminación | — | Se muestra éxito, el usuario desaparece |

| **Resultado obtenido:** | Se muestra "Usuario creado correctamente", el usuario aparece en la tabla, luego se elimina y desaparece. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/06_usuarios.png |

---

#### CP-013 — Almacenero no puede acceder a la gestión de usuarios

| Campo | Valor |
| :--- | :--- |
| **ID** | CP-013 |
| **Módulo** | Usuarios / Seguridad |
| **Historia** | HU10 — Gestionar usuarios y sus roles |
| **Prioridad** | Alta |- Para el video de demostración, se puede grabar la ejecución de `python -m pytest` con una
  herramienta de grabación de pantalla (OBS Studio o similar).
| **Tipo** | Seguridad / Control de acceso |
| **Título** | Verificar que un Almacenero recibe error al intentar acceder a Usuarios |

**Precondiciones:**
1. El usuario tiene sesión activa como Almacenero (almacenero@warevault.com).

**Pasos y datos de prueba:**

| N° | Paso | Datos de entrada | Resultado esperado |
| :--- | :--- | :--- | :--- |
| 1 | Loguearse como Almacenero | almacenero@warevault.com / Almacen123! | Se redirige al Dashboard |
| 2 | Intentar navegar directamente a /usuarios | URL: http://localhost:5173/usuarios | — |
| 3 | Verificar el resultado | — | Se muestra "Acceso denegado: rol insuficiente" |

| **Resultado obtenido:** | El sistema muestra "Acceso denegado: rol insuficiente" y el Almacenero no ve la tabla de usuarios. |
| :--- | :--- |
| **Veredicto:** | PASÓ |
| **Evidencia:** | tests/evidencias/07_usuarios_sin_permiso_almacenero.png |

---

### Tabla resumen de todos los casos de prueba

| ID | Módulo | Título | Tipo | Prioridad | Resultado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| CP-001 | Login | Inicio de sesión exitoso (Admin) | Funcional | Alta | PASÓ |
| CP-002 | Login | Credenciales inválidas rechazadas | Validación | Alta | PASÓ |
| CP-003 | Login | Inicio de sesión exitoso (Almacenero) | Funcional | Media | PASÓ |
| CP-004 | Productos | Crear producto nuevo | Funcional | Alta | PASÓ |
| CP-005 | Productos | Editar nombre de producto | Funcional | Media | PASÓ |
| CP-006 | Productos | Eliminar producto sin movimientos | Funcional | Media | PASÓ |
| CP-007 | Movimientos | Entrada incrementa stock | Funcional | Alta | PASÓ |
| CP-008 | Movimientos | Salida decrementa stock | Funcional | Alta | PASÓ |
| CP-009 | Movimientos | Salida superior rechazada | Validación | Alta | PASÓ |
| CP-010 | Reportes | Bajo stock muestra productos | Funcional | Alta | PASÓ |
| CP-011 | Dashboard | Resumen del inventario | Funcional | Media | PASÓ |
| CP-012 | Usuarios | Crear y eliminar usuario | Funcional | Alta | PASÓ |
| CP-013 | Usuarios | Almacenero sin acceso a Usuarios | Seguridad | Alta | PASÓ |

**Resumen de resultados:**
- Total de casos: 13
- PASÓ: 13
- FALLÓ: 0
- BLOQUEADO: 0
- Tasa de éxito: **100%**

---

## 3.6 Equipo de pruebas y responsabilidades

| Rol | Responsabilidad |
| :--- | :--- |
| Tester / QA | Diseña casos, ejecuta pruebas manuales y automatizadas, reporta bugs |
| Desarrollador | Corrige bugs, mantiene selectores y Page Objects |
| Scrum Master | Integra las pruebas al Definition of Done |
| Product Owner | Valida que los criterios de aceptación coincidan con las historias |

## 3.7 Estructura del proyecto de pruebas:

```
tests/
├── conftest.py              # Fixtures (driver Chrome, login, capturas)
├── pytest.ini               # Configuración y reporte HTML
├── pages/                   # Page Objects (patrón POM)
│   ├── login_page.py
│   ├── productos_page.py
│   ├── movimientos_page.py
│   ├── reportes_page.py
│   └── usuarios_page.py
├── test_cases/              # Casos automatizados
│   ├── test_login.py        # 3 casos
│   ├── test_crud_producto.py
│   ├── test_movimientos.py
│   ├── test_reportes.py
│   └── test_usuarios.py
└── evidencias/              # Reporte HTML y capturas de pantalla
```

## 3.8 Ejecución y demostración

- **Resultado de la ejecución:** 13/13 casos de prueba PASADOS.
- **Reporte automatizado:** `tests/evidencias/reporte_test.html`.
- **Capturas de pantalla** de los módulos del sistema en `tests/evidencias/`.
