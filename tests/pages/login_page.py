"""Page Object de la página de inicio de sesión."""
from selenium.webdriver.common.by import By


class LoginPage:
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def cargar(self):
        self.driver.get(self.base_url + "/login")
        return self

    def iniciar_sesion(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Ingresar')]").click()
