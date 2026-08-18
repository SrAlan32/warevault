"""Page Object de la página de productos (CRUD)."""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class ProductosPage:
    URL = "/productos"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def navegar(self):
        self.driver.get(self.base_url + self.URL)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Nuevo producto')]"))
        )

    def _campo(self, etiqueta):
        return self.driver.find_element(
            By.XPATH, f"//label[contains(normalize-space(.), '{etiqueta}')]/following-sibling::input"
        )

    def abrir_modal_nuevo(self):
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Nuevo producto')]").click()

    def crear_producto(self, sku, nombre, categoria, precio_compra, precio_venta, stock_minimo, stock_inicial):
        self.abrir_modal_nuevo()
        self._campo("SKU").send_keys(sku)
        self._campo("Nombre").send_keys(nombre)
        select = Select(
            self.driver.find_element(
                By.XPATH, "//label[contains(normalize-space(.), 'Categoría')]/following-sibling::select"
            )
        )
        select.select_by_visible_text(categoria)
        self._campo("Precio compra").send_keys(precio_compra)
        self._campo("Precio venta").send_keys(precio_venta)
        self._campo("Stock mínimo").send_keys(stock_minimo)
        self._campo("Stock inicial").send_keys(stock_inicial)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Crear producto')]").click()

    def buscar(self, texto):
        campo = self.driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Buscar por nombre')]")
        campo.clear()
        campo.send_keys(texto)

    def fila_por_sku(self, sku):
        return self.driver.find_element(By.XPATH, f"//tr[td[1][normalize-space()='{sku}']]")

    def stock_de(self, sku):
        fila = self.fila_por_sku(sku)
        return int(fila.find_element(By.XPATH, "./td[4]").text)

    def producto_visible(self, nombre):
        return bool(self.driver.find_elements(By.XPATH, f"//tr[td[2][normalize-space()='{nombre}']]"))

    def editar_nombre(self, sku, nuevo_nombre):
        fila = self.fila_por_sku(sku)
        fila.find_element(By.XPATH, ".//button[contains(text(),'Editar')]").click()
        campo = self._campo("Nombre")
        campo.clear()
        campo.send_keys(nuevo_nombre)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Guardar cambios')]").click()

    def eliminar(self, sku):
        fila = self.fila_por_sku(sku)
        fila.find_element(By.XPATH, ".//button[contains(text(),'Eliminar')]").click()
        self.driver.switch_to.alert.accept()
