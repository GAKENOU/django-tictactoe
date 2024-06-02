from django.shortcuts import render, redirect
from django.http import Http404

# Redirection
def redirect_to_base_path(request):
    return redirect('/tictactoe/')

# Create your views here.
def index(request): 
    return render(request, "index.html", {})

# How to
def howto(request): 
    return render(request, "howto.html", {})

# HOME
def home(request):
    return render(request, "home.html", {})

# GAME
def game(request):
    # choice = request.GET.get("choice")
    char_choice = request.POST.get("character_choice")
    round = request.POST.get("nb_round")
    code = request.POST.get("game_code")
    if char_choice not in ['X', 'O']:
        raise Http404("Choice does not exist")
    
    context = {
        "u_choice": char_choice,
        "round": round,
        "code": code
    }
    return render(request, "game.html", context)