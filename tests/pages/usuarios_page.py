"""Page Object de la página de gestión de usuarios."""
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class UsuariosPage:
    URL = "/usuarios"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def navegar(self):
        self.driver.get(self.base_url + self.URL)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Nuevo usuario')]"))
        )

    def _campo(self, etiqueta):
        return self.driver.find_element(
            By.XPATH, f"//label[contains(normalize-space(.), '{etiqueta}')]/following-sibling::input"
        )

    def crear_usuario(self, nombre, email, password, rol):
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Nuevo usuario')]").click()
        self._campo("Nombre").send_keys(nombre)
        self._campo("Email").send_keys(email)
        self._campo("Contraseña").send_keys(password)
        from selenium.webdriver.support.ui import Select

        select = Select(
            self.driver.find_element(
                By.XPATH, "//label[contains(normalize-space(.), 'Rol')]/following-sibling::select"
            )
        )
        select.select_by_visible_text(rol)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Crear usuario')]").click()

    def usuario_visible(self, email):
        return bool(self.driver.find_elements(By.XPATH, f"//tr[td[2][normalize-space()='{email}']]"))

    def eliminar(self, email):
        fila = self.driver.find_element(By.XPATH, f"//tr[td[2][normalize-space()='{email}']]")
        fila.find_element(By.XPATH, ".//button[contains(text(),'Eliminar')]").click()
        self.driver.switch_to.alert.accept()
