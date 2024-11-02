import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('human'); // 'human' or 'ai'

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i] || (gameMode === 'ai' && !xIsNext)) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = calculateWinner(board);
    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (board.every(Boolean)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const aiMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    const newBoard = board.slice();
    newBoard[bestMove] = 'O';
    setBoard(newBoard);
    setXIsNext(true);
  };

  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !calculateWinner(board)) {
      const timer = setTimeout(aiMove, 500); // Delay AI move for better UX
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, gameMode]);

  const renderSquare = (i) => {
    return (
      <button className="square" onClick={() => handleClick(i)}>
        {board[i]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every(Boolean)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="tic-tac-toe">
      <div className="status">{status}</div>
      <div className="board">
        {[...Array(9)].map((_, i) => renderSquare(i))}
      </div>
      <div className="buttons">
        <button 
          className={`button human ${gameMode === 'human' ? 'active' : ''}`}
          onClick={() => setGameMode('human')}
        >
          Human vs Human
        </button>
        <button 
          className={`button ai ${gameMode === 'ai' ? 'active' : ''}`}
          onClick={() => { setGameMode('ai'); resetGame(); }}
        >
          Human vs AI
        </button>
      </div>
      <button className="button reset" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
