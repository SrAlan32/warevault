"""Casos de prueba: reportes y dashboard (HU7, HU8)."""
from pages.reportes_page import ReportesPage


def test_reporte_bajo_stock_muestra_productos(login_admin, base_url):
    pagina = ReportesPage(login_admin, base_url)
    pagina.navegar()
    assert pagina.producto_en_tabla("Teclado USB"), "El Teclado USB (bajo stock) no aparece"
    assert pagina.producto_en_tabla("Frijoles 2kg"), "Los Frijoles 2kg (bajo stock) no aparecen"
    assert pagina.boton_exportar_presente(), "El botón de exportar CSV no está presente"


def test_dashboard_muestra_resumen(login_admin, base_url):
    login_admin.get(base_url + "/")
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    WebDriverWait(login_admin, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(),'Dashboard')]"))
    )
    for texto in ["Productos registrados", "Movimientos registrados", "Últimos movimientos"]:
        assert texto in login_admin.page_source, f"Falta el elemento '{texto}' en el dashboard"
