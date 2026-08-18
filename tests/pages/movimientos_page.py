"""Page Object de la página de movimientos de inventario."""
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class MovimientosPage:
    URL = "/movimientos"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def navegar(self):
        self.driver.get(self.base_url + self.URL)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Registrar movimiento')]"))
        )

    def seleccionar_producto(self, nombre):
        select = self.driver.find_element(
            By.XPATH, "//label[contains(normalize-space(.), 'Producto')]/following-sibling::select"
        )
        from selenium.webdriver.support.ui import Select

        s = Select(select)
        for op in s.options:
            if op.text.startswith(nombre):
                s.select_by_value(op.get_attribute("value"))
                return
        raise AssertionError(f"Producto '{nombre}' no encontrado en el selector")

    def elegir_tipo(self, tipo):
        self.driver.find_element(
            By.XPATH, f"//input[@name='tipo' and @value='{tipo}']/parent::label"
        ).click()

    def registrar(self, producto_nombre, tipo, cantidad, nota=""):
        self.seleccionar_producto(producto_nombre)
        self.elegir_tipo(tipo)
        campo_cantidad = self.driver.find_element(
            By.XPATH, "//label[contains(normalize-space(.), 'Cantidad')]/following-sibling::input"
        )
        campo_cantidad.clear()
        campo_cantidad.send_keys(str(cantidad))
        if nota:
            campo_nota = self.driver.find_element(
                By.XPATH, "//label[contains(normalize-space(.), 'Nota')]/following-sibling::input"
            )
            campo_nota.send_keys(nota)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Registrar movimiento')]").click()
