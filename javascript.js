const game = (function (doc) {

  const cacheDom = (function () {
    const spaces = doc.querySelectorAll('.space');
    const turn = doc.querySelector('.current-turn');
    const reset = doc.querySelector('button.reset');
    const twoPlayers = doc.querySelector('button.vs-player');
    const easy = doc.querySelector('button.ai-easy');
    const hard = doc.querySelector('button.ai-hard');
    return { spaces, turn, reset, twoPlayers, easy, hard };
  })();



  const board = (function () {
    const array = new Array(9).fill(null);
    const refresh = function () {
      for (let i = 0; i < array.length; i++) {
        cacheDom.spaces[i].innerText = array[i];
      }
    }
    const clear = function () {
      for (let i = 0; i < array.length; i++) {
        array[i] = null;
        cacheDom.spaces[i].classList.remove('colored');
        setTurnText();
      }
      refresh();
      if (mode === 'players') {
        addSpacesListeners();
      }
      else if (mode === 'easy') {
        if (currentTurn === player1) {
          addSpacesListeners();
        }
        else if (currentTurn === player2) {
          makeRandomMove();
        }
      }
    }
    const colorSpaces = function (winningSquares) {
      for (let i = 0; i < 3; i++) {
        cacheDom.spaces[winningSquares[i] - 1].classList.add('colored');
      }
    }

    return { array, refresh, clear, colorSpaces };

  })();

  function checkWin(mark) {
    const arr = board.array;
    if (arr[0] === mark && arr[1] === mark && arr[2] === mark) {
      return [1, 2, 3];
    } else if (arr[3] === mark && arr[4] === mark && arr[5] === mark) {
      return [4, 5, 6];
    } else if (arr[6] === mark && arr[7] === mark && arr[8] === mark) {
      return [7, 8, 9];
    } else if (arr[0] === mark && arr[3] === mark && arr[6] === mark) {
      return [1, 4, 7];
    } else if (arr[1] === mark && arr[4] === mark && arr[7] === mark) {
      return [2, 5, 8];
    } else if (arr[2] === mark && arr[5] === mark && arr[8] === mark) {
      return [3, 6, 9];
    } else if (arr[0] === mark && arr[4] === mark && arr[8] === mark) {
      return [1, 5, 9];
    } else if (arr[2] === mark && arr[4] === mark && arr[6] === mark) {
      return [3, 5, 7];
    }
    else return null;
  }

  function checkTie() {
    const arr = board.array;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) return false;
    }
    return true;
  }

  function setTurnText() {
    cacheDom.turn.innerText = (currentTurn === player1) ? 'TURN: PLAYER 1' : 'TURN: PLAYER 2';
  }

  function makeMove(evt) {
    const space = evt.currentTarget;
    const id = +space.id - 1;
    if (!space.innerText) {
      board.array[id] = currentTurn.mark;
      board.refresh();
      let winningSquares = checkWin(currentTurn.mark);
      if (winningSquares) {
        cacheDom.spaces.forEach(space => space.removeEventListener('click', makeMove));
        board.colorSpaces(winningSquares);
        cacheDom.turn.innerHTML = (currentTurn === player1) ? 'PLAYER 1 WINS' : 'PLAYER 2 WINS';
        return;
      }
      if (checkTie()) {
        cacheDom.spaces.forEach(space => space.removeEventListener('click', makeMove));
        cacheDom.turn.innerHTML = 'TIE';
        return;
      }
      (currentTurn === player1) ? currentTurn = player2 : currentTurn = player1;
      setTurnText();
    }
    easyModeAi();
  }

  function easyModeAi() {
    if (mode === 'easy' && currentTurn === player2) {
      cacheDom.spaces.forEach(space => space.removeEventListener('click', makeMove));
      makeRandomMove();

    }
  }

  function makeRandomMove() {
    const randomID = Math.floor(Math.random() * 9);
    const space = doc.getElementById(String(randomID + 1));
    if (!space.innerText) {
      board.array[randomID] = player2.mark;
      board.refresh();
      let winningSquares = checkWin(player2.mark);
      if (winningSquares) {
        cacheDom.spaces.forEach(space => space.removeEventListener('click', makeMove));
        board.colorSpaces(winningSquares);
        cacheDom.turn.innerHTML = (currentTurn === player1) ? 'PLAYER 1 WINS' : 'PLAYER 2 WINS';
        return;
      }
      if (checkTie()) {
        cacheDom.spaces.forEach(space => space.removeEventListener('click', makeMove));
        cacheDom.turn.innerHTML = 'TIE';
        return;
      }
      (currentTurn === player1) ? currentTurn = player2 : currentTurn = player1;
      setTurnText();
    }
    else {
      makeRandomMove();
    }

    addSpacesListeners();
  }

  function addSpacesListeners() {
    cacheDom.spaces.forEach(space => space.addEventListener('click', makeMove));
  }

  const Player = (mark) => {
    return { mark };
  }


  let player1 = Player('×');
  let player2 = Player('○');
  let mode = 'players';

  let currentTurn = (function () {
    const rand = Math.random();
    return (rand > 0.5) ? player1 : player2;
  })();


  if (mode === 'players') {
    addSpacesListeners();
  }
  else if (mode === 'easy') {
    if (currentTurn === player1) {
      addSpacesListeners();
    }
    else if (currentTurn === player2) {
      makeRandomMove();
    }
  }

  function setEasyMode() {
    mode = 'easy';
    board.clear();
    cacheDom.easy.classList.add('active');
    cacheDom.twoPlayers.classList.remove('active');
  }

  function setPlayerMode() {
    mode = 'players';
    board.clear();
    cacheDom.easy.classList.remove('active');
    cacheDom.twoPlayers.classList.add('active');

  }

  cacheDom.reset.addEventListener('click', board.clear);
  cacheDom.easy.addEventListener('click', setEasyMode);
  cacheDom.twoPlayers.addEventListener('click', setPlayerMode);
  setTurnText();

  return { cacheDom, board };

}
)(document);