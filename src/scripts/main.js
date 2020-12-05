/* eslint-disable operator-linebreak */
/* eslint-disable space-before-function-paren */

'use strict';

const getRandomInteger = (min, max) => {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
};
const startBtn = document.querySelector('.start');

function start() {
  const cells = document.querySelectorAll('.field-cell');
  const scoreDisplay = document.querySelector('.game-score');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  let score = 0;

  function createBoard() {
    [...cells].forEach((cell) => {
      cell.innerHTML = 0;
    });
    generate();
    generate();
  }

  createBoard();

  function generate() {
    const randomNumber = getRandomInteger(0, 15);

    if (cells[randomNumber].innerHTML === '0') {
      for (const cell of cells) {
        if (cell.innerHTML !== '0') {
          cell.className = `field-cell field-cell--${cell.innerHTML}`;
        } else {
          cell.className = `field-cell`;
        }
      }

      cells[randomNumber].innerHTML = '2';
      cells[randomNumber].className = `field-cell field-cell--2`;
      checkForGameOver();
    } else {
      generate();
    }
  }

  function moveX(direction) {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const totalOne = cells[i].innerHTML;
        const totalTwo = cells[i + 1].innerHTML;
        const totalThree = cells[i + 2].innerHTML;
        const totalFour = cells[i + 3].innerHTML;
        const row = [+totalOne, +totalTwo, +totalThree, +totalFour];
        const filtredRow = row.filter((num) => num);
        const missing = 4 - filtredRow.length;
        const zeros = Array(missing).fill(0);
        const getNewRow = () => {
          if (direction === 'right') {
            return [...zeros, ...filtredRow];
          }

          if (direction === 'left') {
            return [...filtredRow, ...zeros];
          }
        };
        const newRow = getNewRow();

        cells[i].innerHTML = newRow[0];
        cells[i + 1].innerHTML = newRow[1];
        cells[i + 2].innerHTML = newRow[2];
        cells[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveY(direction) {
    for (let i = 0; i < 4; i++) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + 4].innerHTML;
      const totalThree = cells[i + 4 * 2].innerHTML;
      const totalFour = cells[i + 4 * 3].innerHTML;
      const column = [+totalOne, +totalTwo, +totalThree, +totalFour];
      const filtredColumn = column.filter((num) => num);
      const missing = 4 - filtredColumn.length;
      const zeros = Array(missing).fill(0);
      const getNewColumn = () => {
        if (direction === 'up') {
          return [...filtredColumn, ...zeros];
        }

        if (direction === 'down') {
          return [...zeros, ...filtredColumn];
        }
      };
      const newColumn = getNewColumn();

      cells[i].innerHTML = newColumn[0];
      cells[i + 4].innerHTML = newColumn[1];
      cells[i + 4 * 2].innerHTML = newColumn[2];
      cells[i + 4 * 3].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (cells[i].innerHTML === cells[i + 1].innerHTML) {
        const combineTotal = +cells[i].innerHTML + +cells[i + 1].innerHTML;

        cells[i].innerHTML = combineTotal;
        cells[i + 1].innerHTML = 0;
        score += combineTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (cells[i].innerHTML === cells[i + 4].innerHTML) {
        const combineTotal = +cells[i].innerHTML + +cells[i + 4].innerHTML;

        cells[i].innerHTML = combineTotal;
        cells[i + 4].innerHTML = 0;
        score += combineTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function control(e) {
    switch (e.code) {
      case 'ArrowUp':
        moveY('up');
        combineColumn();
        moveY('up');
        generate();
        break;
      case 'ArrowDown':
        moveY('down');
        combineColumn();
        moveY('down');
        generate();
        break;
      case 'ArrowLeft':
        moveX('left');
        combineRow();
        moveX('left');
        generate();
        break;
      case 'ArrowRight':
        moveX('right');
        combineRow();
        moveX('right');
        generate();
        break;
      default:
        break;
    }
  }

  document.addEventListener('keydown', control);

  function checkForWin() {
    for (let i = 0; i < cells.length; i++) {
      if (+cells[i].innerHTML === 2048) {
        messageWin.classList.remove('hidden');
        document.removeEventListener('keydown', control);
      }
    }
  }

  function checkForGameOver() {
    let zeros = 0;

    for (let i = 0; i < cells.length; i++) {
      if (+cells[i].innerHTML === 0) {
        zeros++;
      }
    }

    if (zeros === 0) {
      messageLose.classList.remove('hidden');
      document.removeEventListener('keydown', control);
    }
  }
}

startBtn.addEventListener('click', start);
