from dataclasses import dataclass

from textual import on, log, work
from textual.app import ComposeResult
from textual.containers import Container
from textual.message import Message
from textual.widgets import Button, Input, Markdown
from textual.screen import Screen
from email_validator import validate_email

from ui.screens.dashboard_screen import DashboardScreen
from ui.services.auth import log_in


class LoginScreen(Screen):
    """Login screen with input fields and submit button."""

    @dataclass
    class LoginStatus(Message):
        status: str

    def compose(self) -> ComposeResult:
        """Compose the layout of the login screen."""
        yield Container(
            Markdown("# Login to Your Account", id="login_title"),
            Input(placeholder="Enter your email", id="email_input"),
            Input(
                placeholder="Enter your password", password=True, id="password_input"
            ),
            Button("Log in", id="login_button"),
            Button("Back", id="back_button"),
            id="login_container",
        )

    @on(Button.Pressed, "#login_button")
    def handle_login(self) -> None:
        """Handle login button press."""
        email_input = self.query_one("#email_input", Input).value
        password_input = self.query_one("#password_input", Input).value

        if not email_input or not password_input:
            self.notify("Both fields are required.", severity="error")
            return

        email_info = validate_email(email_input, check_deliverability=False)
        normalized_email = email_info.normalized
        log.debug(f"Normalized email: {normalized_email}")
        self.do_login(email_info.normalized, password_input)

    @on(LoginStatus)
    def handle_login_status(self, message: LoginStatus) -> None:
        """Handle login status message."""
        if message.status == "success":
            self.app.push_screen(DashboardScreen())
        elif message.status == "error":
            self.notify(
                "Invalid email or password. Please try again.", severity="error"
            )

    @work(thread=True)
    def do_login(self, email: str, password: str) -> None:
        """Log in a user with email and password."""
        try:
            log(f"Logging in with email: {email}")
            log_in(email, password)
            self.post_message(self.LoginStatus("success"))
        except Exception as e:
            log.error(f"Login error: {str(e)}")
            self.post_message(self.LoginStatus("error"))

    @on(Button.Pressed, "#back_button")
    def go_back(self) -> None:
        """Handle back button press."""
        self.app.pop_screen()
