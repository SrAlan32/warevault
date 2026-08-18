"""Casos de prueba: CRUD de productos (HU1, HU2, HU3)."""
import time
from conftest import esperar_texto
from pages.productos_page import ProductosPage


def _sufijo():
    return str(int(time.time()))[-8:]


def test_crear_producto(login_admin, base_url):
    sku = f"TST-{_sufijo()}"
    nombre = f"Producto Prueba {_sufijo()}"
    pagina = ProductosPage(login_admin, base_url)
    pagina.navegar()
    pagina.crear_producto(sku, nombre, "Electrónica", "10", "25", "2", "0")
    esperar_texto(login_admin, "Producto creado correctamente")
    pagina.buscar(sku)
    assert pagina.producto_visible(nombre), f"El producto '{nombre}' no apareció en la tabla"


def test_editar_producto(login_admin, base_url):
    sku = f"TSE-{_sufijo()}"
    nombre_original = f"Producto Editar {_sufijo()}"
    nuevo_nombre = f"Producto Editado {_sufijo()}"
    pagina = ProductosPage(login_admin, base_url)
    pagina.navegar()
    pagina.crear_producto(sku, nombre_original, "Abarrotes", "5", "12", "1", "0")
    esperar_texto(login_admin, "Producto creado correctamente")
    pagina.buscar(sku)
    pagina.editar_nombre(sku, nuevo_nombre)
    esperar_texto(login_admin, "Producto actualizado correctamente")
    pagina.buscar(sku)
    assert pagina.producto_visible(nuevo_nombre), "El nombre editado no se reflejó en la tabla"


def test_eliminar_producto(login_admin, base_url):
    sku = f"TSD-{_sufijo()}"
    nombre = f"Producto Eliminar {_sufijo()}"
    pagina = ProductosPage(login_admin, base_url)
    pagina.navegar()
    pagina.crear_producto(sku, nombre, "Oficina", "3", "8", "1", "0")
    esperar_texto(login_admin, "Producto creado correctamente")
    pagina.buscar(sku)
    pagina.eliminar(sku)
    esperar_texto(login_admin, "Producto eliminado correctamente")
    pagina.buscar(sku)
    assert not pagina.producto_visible(nombre), "El producto eliminado sigue apareciendo"
