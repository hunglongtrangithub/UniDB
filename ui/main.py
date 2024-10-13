from textual.app import App, ComposeResult
from textual.widgets import Footer, Header

from ui.screens.welcome_screen import WelcomeScreen


class SchoolApp(App):
    TITLE = "UniDB"
    SUB_TITLE = "School Management System"

    def compose(self) -> ComposeResult:
        yield Header()
        yield WelcomeScreen()
        yield Footer()
