"""Casos de prueba: inicio de sesión (HU10 - autenticación)."""
from conftest import esperar_texto, USUARIO_ADMIN
from pages.login_page import LoginPage


def test_login_exitoso_admin(driver, base_url):
    LoginPage(driver, base_url).cargar().iniciar_sesion(*USUARIO_ADMIN)
    esperar_texto(driver, "Dashboard")
    assert "Dashboard" in driver.page_source


def test_login_credenciales_invalidas(driver, base_url):
    LoginPage(driver, base_url).cargar().iniciar_sesion("admin@warevault.com", "clave-incorrecta")
    esperar_texto(driver, "Credenciales inválidas")
    assert "Credenciales inválidas" in driver.page_source


def test_login_rol_almacenero(driver, base_url):
    from conftest import USUARIO_ALMACENERO

    LoginPage(driver, base_url).cargar().iniciar_sesion(*USUARIO_ALMACENERO)
    esperar_texto(driver, "Dashboard")
    assert "Dashboard" in driver.page_source
