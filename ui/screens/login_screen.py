from textual import on, log
from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Button, Input, Markdown
from textual.screen import Screen
from email_validator import validate_email, EmailNotValidError

from ui.screens.dashboard_screen import DashboardScreen
from ui.services.auth import log_in


class LoginScreen(Screen):
    """Login screen with input fields and submit button."""

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

    def check_email(self, email: str) -> str | None:
        """Validate email address. Return normalized email if valid, else None."""
        try:
            emailinfo = validate_email(email, check_deliverability=False)
            email = emailinfo.normalized
            return email
        except EmailNotValidError as e:
            log.info(f"Email is not valid: {str(e)}")
            return None

    @on(Button.Pressed, "#login_button")
    def handle_login(self) -> None:
        """Handle login button press."""
        email_input = self.query_one("#email_input", Input).value
        password_input = self.query_one("#password_input", Input).value

        if not email_input or not password_input:
            self.notify("Both fields are required.", severity="error")
            return

        normalized_email = self.check_email(email_input)
        if not normalized_email:
            self.notify("Invalid email address.", severity="error")
            return

        try:
            log_in(normalized_email, password_input)
            self.app.push_screen(DashboardScreen())
        except Exception as e:
            log.error(f"Login error: {str(e)}")
            self.notify(
                "Invalid email or password. Please try again.", severity="error"
            )

    @on(Button.Pressed, "#back_button")
    def go_back(self) -> None:
        """Handle back button press."""
        self.app.pop_screen()
