"""Casos de prueba: movimientos de inventario (HU4, HU5)."""
import time
from conftest import esperar_texto
from pages.movimientos_page import MovimientosPage
from pages.productos_page import ProductosPage


def _sufijo():
    return str(int(time.time()))[-8:]


def _crear_producto_con_stock(pagina, sku, nombre, stock):
    pagina.crear_producto(sku, nombre, "Electrónica", "20", "40", "5", str(stock))
    esperar_texto(pagina.driver, "Producto creado correctamente")


def test_entrada_incrementa_stock(login_admin, base_url):
    sufijo = _sufijo()
    sku = f"TME-{sufijo}"
    nombre = f"Mov Entrada {sufijo}"
    pagina_productos = ProductosPage(login_admin, base_url)
    pagina_productos.navegar()
    _crear_producto_con_stock(pagina_productos, sku, nombre, 10)

    mov = MovimientosPage(login_admin, base_url)
    mov.navegar()
    mov.registrar(nombre, "ENTRADA", 5, "reposición de prueba")
    esperar_texto(login_admin, "entrada registrado correctamente")

    pagina_productos.navegar()
    pagina_productos.buscar(sku)
    assert pagina_productos.stock_de(sku) == 15, "El stock no se incrementó a 15"


def test_salida_decrementa_stock(login_admin, base_url):
    sufijo = _sufijo()
    sku = f"TMS-{sufijo}"
    nombre = f"Mov Salida {sufijo}"
    pagina_productos = ProductosPage(login_admin, base_url)
    pagina_productos.navegar()
    _crear_producto_con_stock(pagina_productos, sku, nombre, 10)

    mov = MovimientosPage(login_admin, base_url)
    mov.navegar()
    mov.registrar(nombre, "SALIDA", 3, "venta de prueba")
    esperar_texto(login_admin, "salida registrado correctamente")

    pagina_productos.navegar()
    pagina_productos.buscar(sku)
    assert pagina_productos.stock_de(sku) == 7, "El stock no se decrementó a 7"


def test_salida_superior_al_stock_rechazada(login_admin, base_url):
    sufijo = _sufijo()
    sku = f"TMX-{sufijo}"
    nombre = f"Mov Sin Stock {sufijo}"
    pagina_productos = ProductosPage(login_admin, base_url)
    pagina_productos.navegar()
    _crear_producto_con_stock(pagina_productos, sku, nombre, 10)

    mov = MovimientosPage(login_admin, base_url)
    mov.navegar()
    mov.registrar(nombre, "SALIDA", 99999)
    esperar_texto(login_admin, "Stock insuficiente para realizar la salida")
    assert "Stock insuficiente para realizar la salida" in login_admin.page_source
