const solvedBoard = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

let currentBoard = [];
let points = 0;
let hintsLeft = 3;

function copyBoard(board){
  return board.map(row => [...row]);
}

function removeCells(board, level){

  let removeCount = 30;

  if(level === "medium"){
    removeCount = 45;
  }

  if(level === "hard"){
    removeCount = 55;
  }

  while(removeCount > 0){

    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);

    if(board[row][col] !== ""){

      board[row][col] = "";
      removeCount--;

    }
  }
}

function generateGame(){

  const level = document.getElementById("difficulty").value;

  currentBoard = copyBoard(solvedBoard);

  removeCells(currentBoard, level);

  hintsLeft = 3;

  drawBoard();

  updateStats();

  document.getElementById("message").innerText = "";
}

function drawBoard(){

  const board = document.getElementById("board");

  board.innerHTML = "";

  for(let row = 0; row < 9; row++){

    for(let col = 0; col < 9; col++){

      const input = document.createElement("input");

      input.type = "text";
      input.maxLength = "1";

      input.classList.add("cell");

      if(currentBoard[row][col] !== ""){

        input.value = currentBoard[row][col];
        input.disabled = true;

        input.classList.add("fixed");

      }

      input.dataset.row = row;
      input.dataset.col = col;

      input.addEventListener("input", () => {

        input.value = input.value.replace(/[^1-9]/g, "");

        const value = parseInt(input.value);

        if(!value){

          input.style.background = "white";
          return;

        }

        if(value === solvedBoard[row][col]){

          input.style.background = "#bbf7d0";

          points += 5;

        }else{

          input.style.background = "#fecaca";

          if(points > 0){
            points -= 2;
          }

        }

        updateStats();

      });

      board.appendChild(input);

    }
  }
}

function checkSolution(){

  const cells = document.querySelectorAll(".cell");

  let correct = true;

  cells.forEach(cell => {

    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if(parseInt(cell.value) !== solvedBoard[row][col]){

      correct = false;

    }

  });

  const msg = document.getElementById("message");

  if(correct){

    msg.style.color = "green";

    msg.innerText = "🎉 You Won! +100 Points";

    points += 100;

  }else{

    msg.style.color = "red";

    msg.innerText = "❌ Some answers are wrong!";

  }

  updateStats();
}

function giveHint(){

  if(hintsLeft <= 0){

    alert("No hints left!");

    return;
  }

  const cells = document.querySelectorAll(".cell");

  let emptyCells = [];

  cells.forEach(cell => {

    if(cell.value === ""){

      emptyCells.push(cell);

    }

  });

  if(emptyCells.length === 0){

    alert("Board already full!");

    return;
  }

  const randomCell =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  const row = randomCell.dataset.row;
  const col = randomCell.dataset.col;

  randomCell.value = solvedBoard[row][col];

  randomCell.classList.add("hint-cell");

  randomCell.style.background = "#fde68a";

  hintsLeft--;

  points += 10;

  updateStats();
}

function updateStats(){

  document.getElementById("points").innerText = points;

  document.getElementById("hints").innerText = hintsLeft;
}

generateGame();
