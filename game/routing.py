from django.conf.urls import url 
from game.consumers import TicTacToeConsumer

websocket_urlpatterns = [
    url(r'^ws/tictactoe/play/$', TicTacToeConsumer.as_asgi())
]