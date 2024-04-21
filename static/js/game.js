let room_code = document.getElementById("game_board").getAttribute("room_code")
let char_choice = document.getElementById("game_board").getAttribute("char_choice")
let round = document.getElementById("game_board").getAttribute("round")
let curr_round = 1

inner_curr_round = document.getElementById("curr-round")
if (inner_curr_round) {
    inner_curr_round.innerHTML = curr_round
}


let connection_string = 'ws://'+window.location.host+'/tictactoe/play'
// let game_socket = new WebSocket(connection_string)

// Game board
let game_board = [
    -1, -1, -1,
    -1, -1, -1,
    -1, -1, -1
]

// Winning index
win_indices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let move_count = 0   // Number of moves done
let my_turn = true  // Get turn of player
let al_move = document.getElementById("alert_move")

// Add the click event listener on every block
let element_square = document.getElementsByClassName('square')
if (element_square) {
    for (let i = 0; i < element_square.length; i++) {
        element_square[i].addEventListener('click', function() {
            // Retrieve the value of the data-index attribute
            const index = this.getAttribute('data-index');
            console.log('Clicked square with data-index:', index);

            if (game_board[index] == -1) {
                if (al_move) {
                    al_move.style.display = 'none'
                }

                if (my_turn) {
                    make_move(index, char_choice)
                } else {
                    make_move(index, (char_choice == 'X')?'O':'X')
                }
            }
        });
    }
}

// Make move
function make_move(index, player) {
    index = parseInt(index)

    if (game_board[index] == -1) {
        // If the valid move, update the gameboard
        //  state and send the move to the serve
        move_count++
        if (player == 'X') {
            game_board[index] = 1
        } else if (player == 'O') {
            game_board[index] = 0
        } else {
            alert("Invalid character choice")
            return false
        }
        my_turn = (move_count % 2 === 0)
    }

    // Place the move in the game box
    element_square[index].innerHTML = player 

    // Check for the winner
    const win = checkifPlayerWins()
    if (win) {
        curr_round += 1
        reset()

        if (inner_curr_round) {
            inner_curr_round.innerHTML = curr_round
        }
    }
}

// Reset game
function reset() {
    game_board = [
        -1, -1, -1,
        -1, -1, -1,
        -1, -1, -1
    ]
    move_count = 0
    my_turn = true

    if (al_move) {
        al_move.style.display = 'inline'
    }

    for (let i = 0; i < element_square.length; i++) {
        element_square[i].innerHTML = ''
    }
}

// Check if there is a winning move
const checkIsWin = (win_index) => {
    if (
        game_board[win_index[0]] !== -1 && 
        game_board[win_index[0]] === game_board[win_index[1]] &&
        game_board[win_index[0]] === game_board[win_index[2]]
    ) {
        return  true
    }
    return false
}

// Check if player is winner
function checkifPlayerWins() {
    let win = false
    if (move_count >= 5) {
        win_indices.forEach(el => {
            if (checkIsWin(el)) {
                win = true
                win_index = el
            }
        });
    }
    console.log("Is win: ",win);
    return win
}

// Main function which handles the websocket connection
function connect() {
    game_socket.onopen = function open() {
        console.log("Websockets connection created");

        // On websocket open, send the START event
        game_socket.send(JSON.stringify({
            "event": "START",
            "message": ""
        }))
    }

    game_socket.onclose = function(e) {
        console.log("Socket is closed.  Reconnect will be attempted en i second.", e.reason);
        setTimeout(() => {
            connect()
        }, 1000);
    }

    // Sennding the info about the rooom
    game_socket.onmessage = function(e) {
        // On getting the messgae from the server
        // do the appropriate steps on each event
        let data = JSON.parse.parse(e.data)
        data = data["payload"]

        let message  = data["message"]
        let event  = data["event"]

        switch (event){
            case "START":
                reset()
                break;
            case "END":
                alert(message)
                reset()
                break;
            case "MOVE":
                if (message["player"] != char_choice) {
                    make_move(message["index"], message["player"])
                    my_turn = true

                    if (al_move) {
                        al_move.style.display = 'inline'
                    }
                }
                break;
            default:
                console.log("No event");
        }
    }

    if (game_socket.readyState == WebSocket.OPEN) {
        game_socket.onopen()
    }
}

// connect()