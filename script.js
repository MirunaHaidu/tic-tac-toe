

function createGameboard() {
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push(Cell());
        }
    }

    const getBoard = () => gameboard;


    const printBoard = () => {
        const boardWithCellValues = gameboard.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // need to return the method for adding X or Y
    return { getBoard, printBoard };
}


function Cell() {
    let value = 0;

    const addSign = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addSign,
        getValue
    };
}


function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const gameboard = createGameboard();
    const players = [
        {
            name: playerOneName,
            sign: 1
        },
        {
            name: playerTwoName,
            sign: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
    const getBoard = () => gameboard;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {

        const selectedCell = gameboard.getBoard()[row][column];
        if (selectedCell.getValue() === 0) {
            selectedCell.addSign(getActivePlayer().sign);

            const winner = checkForWinner();
            if (winner) {
                console.log(`${winner.name} wins!`);
                return;
            }

            if (isBoardFull()) {
                console.log("It's a tie!");
                return;
            }

            switchPlayerTurn();
            printNewRound();
        } else {
            console.log("This cell is already occupied");
        }


    };

    const isBoardFull = () => {
        const board = gameboard.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === 0) {
                    return false;
                }
            }
        }
        return true;
    };


    const checkForWinner = () => {
        const board = gameboard.getBoard();
        for (let i = 0; i < 3; i++) {
            if (
                (board[i][0].getValue() !== 0 && board[i][0].getValue() === board[i][1].getValue() && board[i][0].getValue() === board[i][2].getValue()) ||
                (board[0][i].getValue() !== 0 && board[0][i].getValue() === board[1][i].getValue() && board[0][i].getValue() === board[2][i].getValue())
            )
                return getActivePlayer();
        }

        if (
            (board[0][0].getValue() !== 0 && board[0][0].getValue() === board[1][1].getValue() && board[0][0].getValue() === board[2][2].getValue()) ||
            (board[0][2].getValue() !== 0 && board[0][2].getValue() === board[1][1].getValue() && board[0][2].getValue() === board[2][0].getValue())
        ) {
            return getActivePlayer(); // Return the winning player object
        }

        return null;
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard
    }
}


const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("text");
    const restartBtn = document.getElementById("restartBtn");

    cells.forEach((cell) =>
        cell.addEventListener("click", (e) => {
            const cellId = parseInt(e.target.id);
            const row = Math.floor(cellId / 3);
            const column = cellId % 3;
            game.playRound(row, column);
            updateUI();
        })
    );

    restartBtn.addEventListener("click", () => {
        game = GameController();
        updateUI();
    });

    const updateUI = () => {
        const activePlayer = game.getActivePlayer();
        message.textContent = `${activePlayer.name}'s turn`;

        const board = game.getBoard().getBoard();
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const column = index % 3;
            const cellValue = board[row][column].getValue();

            cell.textContent = cellValue === 1 ? "❌" : cellValue === 2 ? "⭕" : "";
            // Remove existing classes
        cell.classList.remove("cell-x", "cell-o", "cell-empty");

        // Add class based on the cell value
        if (cellValue === 1) {
            cell.classList.add("cell-x");
        } else if (cellValue === 2) {
            cell.classList.add("cell-o");
        } else {
            cell.classList.add("cell-empty");
        }
        });
    };
})();


let game = GameController();




