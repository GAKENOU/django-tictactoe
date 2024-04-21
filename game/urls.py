from django.urls import path
from . import views

app_name = "tictactoe"
urlpatterns = [
    path("", views.index, name="index"),
    path("play/", views.game, name="game")
]