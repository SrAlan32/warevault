"""Page Object de la página de reportes de bajo stock."""
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class ReportesPage:
    URL = "/reportes"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def navegar(self):
        self.driver.get(self.base_url + self.URL)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Exportar CSV')]"))
        )

    def producto_en_tabla(self, nombre):
        return bool(self.driver.find_elements(By.XPATH, f"//tr[td[2][normalize-space()='{nombre}']]"))

    def boton_exportar_presente(self):
        return bool(self.driver.find_elements(By.XPATH, "//button[contains(text(),'Exportar CSV')]"))
