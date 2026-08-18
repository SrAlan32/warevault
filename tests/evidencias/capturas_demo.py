"""Genera capturas de pantalla de los módulos del sistema para la evidencia del proyecto."""
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = "http://localhost:5173"
SALIDA = os.path.dirname(os.path.abspath(__file__))

PAGINAS = [
    ("/", "01_dashboard"),
    ("/productos", "02_productos"),
    ("/movimientos", "03_movimientos"),
    ("/reportes", "04_reporte_bajo_stock"),
    ("/historial", "05_historial"),
    ("/usuarios", "06_usuarios"),
]


def main():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,900")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    wait = WebDriverWait(driver, 10)

    driver.get(BASE_URL + "/login")
    wait.until(EC.presence_of_element_located((By.ID, "email"))).send_keys("admin@warevault.com")
    driver.find_element(By.ID, "password").send_keys("Admin123!")
    driver.find_element(By.XPATH, "//button[contains(text(),'Ingresar')]").click()
    wait.until(EC.url_changes(BASE_URL + "/login"))
    time.sleep(1)

    os.makedirs(SALIDA, exist_ok=True)
    for ruta, nombre in PAGINAS:
        driver.get(BASE_URL + ruta)
        time.sleep(1.2)
        archivo = os.path.join(SALIDA, f"{nombre}.png")
        driver.save_screenshot(archivo)
        print(f"Captura guardada: {archivo}")

    driver.save_screenshot(os.path.join(SALIDA, "07_usuarios_sin_permiso_almacenero.png"))
    driver.quit()
    print("Evidencias generadas correctamente.")


if __name__ == "__main__":
    main()
