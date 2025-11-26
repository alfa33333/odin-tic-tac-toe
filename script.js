function gameboard(){
    let board = [];

    for(let row=0; row< 3; row++){
        board[row] = [];
        for(let column=0; column < 3; column++)
        {
            board[row].push(cell());
        }
    }

    function setBoard(posX, posY, player){
        if (posX < 0 || posX > 2 || posY < 0 || posY > 2){
            console.log("invalid position");
            return;
        }

        if (board[posY][posX].getValue() === null){
            if (player === 'x'){
                board[posY][posX].setX();
            } else {
                board[posY][posX].setO();
            }
        } else {
            console.log("cell already occupied");
            return ;
        }
        return 0;
    }

    function getBoard(){
        return board;
    }

    function printBoard(){
        const displayBoard = board.map(row => row.map(cell => cell.getValue() || '-').join(' ')).join('\n');
        console.log(displayBoard);
    }

    return {
        setBoard,
        getBoard,
        printBoard  
    };
}

function cell(){
    let value = null;

    function setX(){
        if(value !== null) return;
        value= 'x';
    }

    function setO(){
        if(value !== null) return;
        value= 'o';
    }

    function getValue(){
        return value;
    }

    return {
        setX,
        setO,
        getValue
    }
}

const gameloop = ( function (  
    playerOneName = "Player One",
    playerTwoName = "Player Two"){
    console.log("welcome to the game")

    const players = [
        {
            name: playerOneName,
            token: 'x'
        },
        {
            name:playerTwoName,
            token: 'o'
        }
    ];

    const game = gameboard();
    game.printBoard();

    let activePlayer = players[0];

    function getActivePlayer () {
        return activePlayer;
    }

    function switchPlayer(){
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    }

    const playRound = (posX, posY) => {
        const complete = game.setBoard(posX, posY, activePlayer.token);

        if( complete === 0){
            switchPlayer();
        }
        game.printBoard();
    };

    return {
        playRound,
        getActivePlayer
    };
}
)();