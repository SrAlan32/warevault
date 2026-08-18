"""Casos de prueba: gestión de usuarios y control de roles (HU10, RNF-05)."""
import time
from conftest import esperar_texto, USUARIO_ALMACENERO
from pages.usuarios_page import UsuariosPage


def test_admin_crea_y_elimina_usuario(login_admin, base_url):
    sufijo = str(int(time.time()))[-8:]
    nombre = f"Usuario Prueba {sufijo}"
    email = f"prueba{sufijo}@warevault.com"
    pagina = UsuariosPage(login_admin, base_url)
    pagina.navegar()
    pagina.crear_usuario(nombre, email, "Clave123!", "Almacenero")
    esperar_texto(login_admin, "Usuario creado correctamente")
    assert pagina.usuario_visible(email), "El usuario creado no aparece en la tabla"

    pagina.eliminar(email)
    esperar_texto(login_admin, "Usuario eliminado correctamente")
    assert not pagina.usuario_visible(email), "El usuario eliminado sigue apareciendo"


def test_almacenero_no_puede_gestionar_usuarios(login_admin, base_url):
    from pages.login_page import LoginPage

    LoginPage(login_admin, base_url).cargar().iniciar_sesion(*USUARIO_ALMACENERO)
    esperar_texto(login_admin, "Dashboard")
    login_admin.get(base_url + "/usuarios")
    esperar_texto(login_admin, "Acceso denegado: rol insuficiente")
    assert "Acceso denegado: rol insuficiente" in login_admin.page_source
