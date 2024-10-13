from textual import on
from textual.app import ComposeResult
from textual.widgets import Button, Label, Markdown
from textual.screen import Screen

from ui.services.auth import log_out

text = """
# Dashboard

This is your dashboard. You can perform the following actions:

- View your profile
- Update your profile
- Logout
"""


class DashboardScreen(Screen):
    """Dashboard screen after successful login."""

    def compose(self) -> ComposeResult:
        yield Label("Welcome to the dashboard!")
        yield Markdown(text, name="help")
        yield Button("Logout", id="logout_button")

    @on(Button.Pressed, "#logout_button")
    def handle_logout(self) -> None:
        log_out()
        self.app.pop_screen()
