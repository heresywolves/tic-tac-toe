(function (doc) {

  
  const gameBoard = (function() {
    const boardArray = new Array(9).fill(null);
    const refresh = (arr) => {

    }
    return {boardArray};  
  })(); 
  
  const Player = (mark) => {
    return {mark};
  }

  let player1 = Player('o');
  let player2 = Player('x');
  
  console.log(player1);


}
)(document);