from django.urls import path
from . import views

app_name = "tictactoe"
urlpatterns = [
    # path("", views.index, name="index"),
    # path("home/", views.home, name="home.html"),

    path("", views.home, name="home"),
    path("howto/", views.howto, name="howto"),
    path("game/", views.index, name="index"),
    path("play/", views.game, name="game")
]