from textual import on
from textual.app import ComposeResult
from textual.containers import Container
from textual.widgets import Button, Label, Markdown
from textual.screen import Screen

from ui.screens.login_screen import LoginScreen
from ui.screens.signup_screen import SignupScreen

text = """
# Welcome to the School Management System

"""


class WelcomeScreen(Screen):
    """Welcome Page screen (Unauthenticated users)."""

    def compose(self) -> ComposeResult:
        yield Container(
            Markdown(text),
            Container(
                Label("Please log in or sign up to access your dashboard."),
                Button("Log in", id="login_button"),
                Label("New user? Sign up here."),
                Button("Sign up", id="signup_button"),
                id="button_container",
            ),
            id="welcome_screen",
        )

    @on(Button.Pressed, "#login_button")
    def handle_login(self) -> None:
        self.app.push_screen(LoginScreen())

    @on(Button.Pressed, "#signup_button")
    def handle_signup(self) -> None:
        self.app.push_screen(SignupScreen())
