from textual import on, log
from textual.app import ComposeResult
from textual.widgets import Button, Input, Markdown, Label
from textual.containers import Container
from textual.screen import Screen
from password_validator import PasswordValidator
from email_validator import validate_email, EmailNotValidError

from ui.screens.login_screen import LoginScreen
from ui.services.auth import sign_up

text = """
# Sign up

Please enter your email and password to sign up.
Requirements for password:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one symbol

"""


class SignupScreen(Screen):
    """Signup screen with input fields and submit button."""

    def compose(self) -> ComposeResult:
        """Compose the layout of the signup screen."""
        self.email_input = Input(placeholder="Enter your email", id="email_input")
        self.email_error = Label("", id="email_error")
        self.email_error.styles.color = "red"

        self.password_input = Input(
            placeholder="Enter your password",
            password=True,
            id="password_input",
        )
        self.password_error = Label("", id="password_error")
        self.password_error.styles.color = "red"

        self.confirm_password_input = Input(
            placeholder="Confirm your password",
            password=True,
            id="confirm_password_input",
        )
        self.confirm_password_error = Label("", id="confirm_password_error")
        self.confirm_password_error.styles.color = "red"

        yield Container(
            Markdown(text),
            self.email_input,
            self.email_error,
            self.password_input,
            self.password_error,
            self.confirm_password_input,
            self.confirm_password_error,
            Button("Sign up", id="signup_button"),
            Button("Switch to Login", id="switch_to_login_button"),
            id="signup_container",
        )

    def check_email(self, email: str) -> str | None:
        """Validate email address. Return normalized email if valid, else None."""
        try:
            emailinfo = validate_email(email, check_deliverability=False)
            return emailinfo.normalized
        except EmailNotValidError as e:
            log.info(f"Email is not valid: {str(e)}")
            return None

    def check_password(self, password: str) -> bool:
        """Validate password. Return True if valid, else False."""
        password_validator = PasswordValidator()
        password_validator.min(8).max(
            100
        ).has().uppercase().has().lowercase().has().digits().has().symbols()
        return password_validator.validate(password)

    @on(Input.Changed, "#email_input")
    def show_email_error(self):
        email_input = self.email_input.value
        if not email_input:
            return
        email = self.check_email(email_input)
        if not email:
            self.email_error.update("Invalid email address.")
        else:
            self.email_error.update("")

    @on(Input.Changed, "#password_input")
    def show_password_error(self):
        password_input = self.password_input.value
        if not password_input:
            return
        log.debug(f"Password input: {password_input}")
        if not self.check_password(password_input):
            self.password_error.update("Invalid password.")
        else:
            self.password_error.update("")

    @on(Input.Changed, "#confirm_password_input")
    def show_confirm_password_error(self):
        confirm_password_input = self.confirm_password_input.value
        if not confirm_password_input:
            return
        log.debug(f"Confirm password input: {confirm_password_input}")
        password_input = self.query_one("#password_input", Input).value
        if password_input != confirm_password_input:
            self.confirm_password_error.update("Passwords do not match.")
        else:
            self.confirm_password_error.update("")

    @on(Button.Pressed, "#signup_button")
    def handle_signup(self) -> None:
        """Handle signup button press."""
        email_input = self.email_input.value
        password_input = self.password_input.value
        confirm_password_input = self.confirm_password_input.value

        if not email_input or not password_input or not confirm_password_input:
            self.notify("All fields are required.", severity="error")
            return

        normalized_email = self.check_email(email_input)
        if not normalized_email:
            self.notify("Invalid email address.", severity="error")
            return
        if not self.check_password(password_input):
            self.notify("Invalid password.", severity="error")
            return
        if password_input != confirm_password_input:
            self.notify("Passwords do not match.", severity="error")
            return

        try:
            sign_up(normalized_email, password_input)
            self.notify("Registration successful! Please log in.")
            self.app.switch_screen(LoginScreen())
        except Exception as e:
            log.error(f"Signup error: {str(e)}")
            self.notify(
                "Invalid email or password. Please try again.", severity="error"
            )

    @on(Button.Pressed, "#switch_to_login_button")
    def switch_to_login(self) -> None:
        """Switch back to the login screen."""
        self.app.switch_screen(LoginScreen())
