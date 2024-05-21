
let game_board_selector = document.getElementById("game_board")
let char_choice = ''
let episode = 0
if (game_board_selector) {
    char_choice = game_board_selector.getAttribute("char_choice")
    episode = game_board_selector.getAttribute("round")
}



let curr_round = 1

inner_curr_round = document.getElementById("curr-round")
if (inner_curr_round) {
    inner_curr_round.innerHTML = curr_round
}

inner_player2 = document.getElementById("player2")
if (inner_player2) {
    inner_player2.innerHTML = (char_choice == 'X')?'O':'X'
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
let next_turn = my_turn
let al_move = document.getElementById("alert_move")

// Help set active background on player on it's turn to play
let player_1 = document.getElementById('player-1')  
let player_2 = document.getElementById('player-2')

// Score
let score_player_1 = 0,
    score_player_2 = 0
let score_1 = document.getElementById('score-player-1'),
    score_2 = document.getElementById('score-player-2')

let reset_game = document.getElementById('reset-game')

let show_winner_1 = document.getElementById('winner-1')
let show_winner_2 = document.getElementById('winner-2')

let line = document.getElementById('win-line')
let to_next = document.getElementById('to-next')

let player1_mover = false,
    player2_mover = false,
    prev_position = -99

let win_grouped_index = ''

if (score_1 && score_2) {
    score_1.innerHTML = 0
    score_2.innerHTML = 0
}

if (al_move) {
    al_move.innerHTML = char_choice
}

let modal = document.getElementById("c-modal")
let warning_msg = document.getElementById("warning-msg")
if (modal) {
    modal.style.display = 'none'
}


// Add the click event listener on every block
let element_square = document.getElementsByClassName('square')
if (element_square) {
    for (let i = 0; i < element_square.length; i++) {
        element_square[i].addEventListener('click', function() {
            // Retrieve the value of the data-index attribute
            const index = this.getAttribute('data-index');

            if (!checkIfCanPlay()) {    // checks if can continue placing symbols 
                // If can't continue, it means each user has placed in total 3 symbols
                if (prev_position == -99 && game_board[index] != -1) {
                    // Now users only have the possibility to change position of placed symbols
                    setPositionToChange(index, my_turn, game_board[index])
                } else if (prev_position == -99) {
                    if (warning_msg) {
                        warning_msg.innerHTML = "Impossible de placer un nouvel symbole ! Merci de cliquer sur un symbole puis replacer."
                    }
                    modal.style.display = 'flex'
                }
                
                if (prev_position == -99) {
                    return;
                }
            }

            if (game_board[index] == -1) {
                if (prev_position != -99) {
                    changePosition(prev_position)
                    prev_position = -99
                }

                if (my_turn) {
                    if (al_move) {
                        al_move.innerHTML = (char_choice == 'X')?'O':'X'

                        setPlayerToActive(false)
                    }
                    make_move(index, char_choice)
                } else {
                    if (al_move) {
                        al_move.innerHTML = char_choice

                        setPlayerToActive(true)
                    }
                    make_move(index, (char_choice == 'X')?'O':'X')
                }
            }
        });
    }
}

/**
 * Check if each user has placed at least 3 symbol.
 * This let each user to place only 3 symbols within the square
 * @returns true If one of the user hasn't placed in total 3 symbol
 */
function checkIfCanPlay() {
    let can_play = false
    
    let empty_box_counter = 0
    for (let i = 0; i < game_board.length; i++) {
        if (game_board[i] == -1) {
            empty_box_counter++
        }
    }
    can_play = (empty_box_counter == 3)?false:true

    return can_play
}

/**
 * Set the position of symbol to move to another position
 * @param {*} index 
 * @param {*} is_payer1_turn 
 * @param {*} is_payer_1 
 * @returns 
 */
function setPositionToChange(index, is_payer1_turn, is_payer_1) {
    console.log("is_payer1_turn: ",is_payer1_turn, " >>> ", char_choice);
    symbol_turn = ''
    if (is_payer1_turn) {
        symbol_turn = char_choice
    } else {
        symbol_turn = (char_choice == 'X')?'O':'X'
    }

    if (warning_msg) {
        warning_msg.innerHTML = "Impossible de déplacer ce symbole ! Merci de passer la main au Joueur "+symbol_turn
    }


    if ((is_payer1_turn && is_payer_1 === 0) || (!is_payer1_turn && is_payer_1 === 1)) {
        modal.style.display = 'flex'
        return;
    }

    const sq_selector = element_square[index].getAttribute('id')
    let selected_square = document.getElementById(sq_selector)  
    if (selected_square) {
        selected_square.classList.add('delete')
    }
    prev_position = index
    
}

function changePosition(prev_position) {
    game_board[prev_position] = -1
    element_square[prev_position].innerHTML = ''

    const sq_selector = element_square[prev_position].getAttribute('id')
    let selected_square = document.getElementById(sq_selector)  
    if (selected_square) {
        selected_square.classList.remove('delete')
    }
}

function setPlayerToActive(is_payer_1) {
    if (is_payer_1) {
        if (player_1 && player_2) {
            player_1.classList.add('active')
            player_2.classList.remove('active')
        }
    } else {
        if (player_1 && player_2) {
            player_1.classList.remove('active')
            player_2.classList.add('active')
        }
    }
}

// Make move
function make_move(index, player) {
    index = parseInt(index)

    if (game_board[index] == -1) {
        // If the valid move, update the gameboard
        //  state and send the move to the serve
        move_count++
        if (player == char_choice) {
            game_board[index] = 1
        } else {
            game_board[index] = 0
        } 
        
        if (next_turn) {
            my_turn = (move_count % 2 === 0)
        } else {
            my_turn = (move_count % 2 !== 0)
        }
        
    }

    // Place the move in the game box
    element_square[index].innerHTML = player 

    

    // Check for the winner
    const win = checkifPlayerWins()
    if (win) {
        if (curr_round == episode) {
            showFinalWinner()
        }

        if (curr_round < episode) {

            setTimeout(() => {
                game_board = [
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0
                ]
                to_next.style.display = 'block'
            }, 1500);
        }
    }
}

function next() {
    reset()
    curr_round += 1
    if (inner_curr_round) {
        inner_curr_round.innerHTML = curr_round
    }
}

function showFinalWinner() {
    game_board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]

    if (score_player_1 > score_player_2) {
        if (show_winner_1 && show_winner_2) {
            let img_1 = ''+
                '<img src="/static/images/winner.png" alt="WINNER">';

            let img_2 = ''+
                '<img src="/static/images/loser.png" alt="WINNER">';

            show_winner_1.innerHTML = img_1
            show_winner_2.innerHTML = img_2
        }
    } else {
        if (show_winner_1 && show_winner_2) {
            let img_1 = ''+
                '<img src="/static/images/loser.png" alt="WINNER">';
            let img_2 = ''+
                '<img src="/static/images/winner.png" alt="WINNER">';

            show_winner_1.innerHTML = img_1
            show_winner_2.innerHTML = img_2
        }
    }
}

// Reset game
function reset() {
    if (reset_game) {
        reset_game.style.display = 'none'
    }
    to_next.style.display = 'none'

    if (line) {
        line.classList.remove('win-line-'+win_grouped_index)
    }

    game_board = [
        -1, -1, -1,
        -1, -1, -1,
        -1, -1, -1
    ]
    move_count = 0
    my_turn = next_turn

    // if (al_move) {
    //     al_move.style.display = 'inline'
    // }
    if (al_move) {
        let next_char = (char_choice == 'X')?'O':'X'
        al_move.innerHTML = (next_turn)?char_choice:next_char
        setPlayerToActive(next_turn)
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
        if (game_board[win_index[0]] == 1) {
            // >>>>>>>  Player 1 wins
            score_player_1++
            next_turn = true
            if (score_1 && score_2) {
                score_1.innerHTML = score_player_1
            }
        } else if (game_board[win_index[0]] == 0) {
            // >>>>>>>  Player 2 wins
            score_player_2++
            next_turn = false
            if (score_1 && score_2) {
                score_2.innerHTML = score_player_2
            }
        }
        return  true
    }
    return false
}

// Check if player is winner
function checkifPlayerWins() {
    win_grouped_index = ''
    let win = false
    if (move_count >= 5) {
        win_indices.forEach(indices => {
            if (checkIsWin(indices)) {
                win = true
                win_index = indices

                indices.forEach(indice => {
                    win_grouped_index += indice
                });
                drawWinnerLine(win_grouped_index)
            }
        });
    }
    
    return win
}

function drawWinnerLine(win_grouped_index) {
    if (line) {
        line.classList.add('win-line-'+win_grouped_index)
    }
}


function closeModal() {
    if (modal) {
        modal.style.display = 'none'
    }
}

function submitForm() {
    let nb_round = document.getElementById('nb-round')
    let can_show_modal = false
    if (nb_round) {
        if (nb_round.value % 2 == 0) {
            if (warning_msg) {
                warning_msg.innerHTML = "Merci de saisir un nombre impair !"
            }
            can_show_modal = true
        } else if (nb_round.value > 5) {
            if (warning_msg) {
                warning_msg.innerHTML = "Merci de saisir un nombre inférieur ou égal à 5 !"
            }
            can_show_modal = true
        }

        if (can_show_modal) {
            modal.style.display = 'flex'
            return;
        }
        
        let play_game = document.getElementById('play-game')
        if (play_game) {
            play_game.submit()
        }
    }
}
// connect()