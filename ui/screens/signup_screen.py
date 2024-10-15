from dataclasses import dataclass

from textual import on, log, work
from textual.app import ComposeResult
from textual.message import Message
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

password_validator = PasswordValidator()
# fmt: off
password_validator\
.min(8)\
.max(100)\
.has().uppercase()\
.has().lowercase()\
.has().digits()\
.has().symbols()
# fmt: on


class SignupScreen(Screen):
    """Signup screen with input fields and submit button."""

    @dataclass
    class SignupStatus(Message):
        status: str

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

    @work(thread=True)
    def check_email(self, email: str) -> None:
        """Validate email address"""
        try:
            validate_email(email, check_deliverability=True)
        except EmailNotValidError as e:
            self.app.call_from_thread(self.email_error.update, "Invalid email address.")
            log.info(f"Email is not valid: {str(e)}")
        else:
            self.app.call_from_thread(self.email_error.update, "")

    @work(thread=True)
    def check_password(self, password: str) -> None:
        """Validate password"""
        is_valid = password_validator.validate(password)
        if not is_valid:
            self.app.call_from_thread(self.password_error.update, "Invalid password.")
        else:
            self.app.call_from_thread(self.password_error.update, "")

    @on(Input.Changed, "#email_input")
    def show_email_error(self):
        email_input = self.email_input.value
        if not email_input:
            self.email_error.update("Field is required.")
            return
        self.check_email(email_input)

    @on(Input.Changed, "#password_input")
    def show_password_error(self):
        password_input = self.password_input.value
        if not password_input:
            self.password_error.update("Field is required.")
            return
        self.check_password(password_input)

    @on(Input.Changed, "#confirm_password_input")
    def show_confirm_password_error(self):
        confirm_password_input = self.confirm_password_input.value
        if not confirm_password_input:
            self.confirm_password_error.update("Field is required.")
            return
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
        if not (
            self.email_error.renderable == ""
            and self.password_error.renderable == ""
            and self.confirm_password_error.renderable == ""
        ):
            self.notify("Please fix the errors above.", severity="error")
            return

        email_info = validate_email(email_input, check_deliverability=False)
        normalized_email = email_info.normalized
        log.debug(f"Normalized email: {normalized_email}")
        self.do_signup(normalized_email, password_input)

    @on(SignupStatus)
    def handle_signup_status(self, message: SignupStatus) -> None:
        """Handle signup status message."""
        if message.status == "success":
            self.notify("Registration successful! Please log in.")
            self.app.switch_screen(LoginScreen())
        else:
            self.notify(
                "Invalid email or password. Please try again.", severity="error"
            )

    @work(thread=True)
    def do_signup(self, email: str, password: str) -> None:
        """Sign up with email and password."""
        try:
            log.info(f"Signing up with email: {email}")
            sign_up(email, password)
            self.post_message(self.SignupStatus("success"))
        except Exception as e:
            log.error(f"Signup error: {str(e)}")
            self.post_message(self.SignupStatus("error"))

    @on(Button.Pressed, "#switch_to_login_button")
    def switch_to_login(self) -> None:
        """Switch back to the login screen."""
        self.app.switch_screen(LoginScreen())
