"""Fixtures y configuración de las pruebas automatizadas con Selenium."""
import base64
import os
import pytest
from pytest_html import extras as html_extras
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = "http://localhost:5173"

USUARIO_ADMIN = ("admin@warevault.com", "Admin123!")
USUARIO_ALMACENERO = ("almacenero@warevault.com", "Almacen123!")

EVIDENCIAS = os.path.join(os.path.dirname(__file__), "evidencias")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,900")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


def login(driver, base_url, email, password):
    """Inicia sesión a través de la interfaz web."""
    driver.get(base_url + "/login")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.ID, "email"))).send_keys(email)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[contains(text(),'Ingresar')]").click()
    wait.until(EC.url_changes(base_url + "/login"))


@pytest.fixture
def login_admin(driver, base_url):
    login(driver, base_url, *USUARIO_ADMIN)
    yield driver


@pytest.fixture
def login_almacenero(driver, base_url):
    login(driver, base_url, *USUARIO_ALMACENERO)
    yield driver


def esperar_texto(driver, texto, timeout=10):
    """Espera a que aparezca un texto en la página."""
    WebDriverWait(driver, timeout).until(
        lambda d: texto in d.page_source
    )


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook que captura screenshot al final de cada test y lo incrusta en el reporte HTML."""
    outcome = yield
    report = outcome.get_result()

    if report.when != "call":
        return
    if "driver" not in getattr(item, "funcargs", {}):
        return

    driver = item.funcargs["driver"]
    os.makedirs(EVIDENCIAS, exist_ok=True)
    nombre = item.name.replace("[", "_").replace("]", "_")
    archivo = os.path.join(EVIDENCIAS, f"{nombre}.png")

    try:
        driver.save_screenshot(archivo)
    except Exception:
        return

    try:
        with open(archivo, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode("utf-8")
        extras = getattr(report, "extras", [])
        extras.append(html_extras.image(img_b64))
        report.extras = extras
    except Exception:
        pass
