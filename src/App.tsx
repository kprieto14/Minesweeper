import React, { useState } from 'react'
import { Cell } from './components/Cell'

type Square = '_' | 'F' | ' ' | '*' | '@' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
type Row = [Square, Square, Square, Square, Square, Square, Square, Square]
type Board = [Row, Row, Row, Row, Row, Row, Row, Row]
type Game = {
  board: Board
  id: null | number
  difficulty: null | number
  state: null | string
  mines: null | number
}

export function App() {
  const [game, setGame] = useState<Game>({
    board: [
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ']
    ],
    id: null,
    difficulty: null,
    state: null,
    mines: null
  })

  const [difficulty, setDifficulty] = useState<0 | 1 | 2>(0)

  async function recordMove(row: number, col: number) {
    if (
      // No game id
      game.id === undefined ||
      // A game is finished
      game.state === 'won' ||
      game.state === 'lost' ||
      // The space isn't blank
      game.board[row][col] !== ' '
    ) {
      return
    }
    
    // Generate the URL we need
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/check`
    // Make an object to send as JSON
    const body = { row, col }
    // Make a POST request to make a move
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // Get the response as JSON
      const newGame = await response.json()
      // Make that the new state!
      setGame(newGame)
    }
  }

  async function handleNewGame(newDifficulty: 0 | 1 | 2) {
    const gameOptions = { difficulty: newDifficulty }
    // Make a POST request to ask for a new game
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(gameOptions)
      }
    )
    if (response.ok) {
      // Get the response as JSON
      const newGame = await response.json() as Game
      // Make that the new state!
      setDifficulty(newDifficulty)
      setGame(newGame)
    }
  }

  async function recordFlag(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: number, col: number) {
    event.preventDefault()

    if (
      // No game id
      game.id === undefined ||
      // A game is finished
      game.state === 'won' ||
      game.state === 'lost' 
    ) {
      return
    }
    
    // Generate the URL we need
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/flag`
    // Make an object to send as JSON
    const body = { row, col }
    // Make a POST request to make a move
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // Get the response as JSON
      const newGame = await response.json()
      // Make that the new state!
      setGame(newGame)
    }
  }

  function newHeader() {
    if(game.state === "new") {
      return `New game started.`
    } else if(game.state === "playing") {
      return `Minesweeping in progress.`
    } else if(game.state === 'won' || game.state === 'lost')
      return `Game ${game.state}`
  }

  const header = game.state ? newHeader() : 'Minesweeper'

  return (
    <div>
      <header>
        <h1>{header}</h1>
        <h2>
         <button onClick={() => handleNewGame(0)}>New Easy Game</button>
         <button onClick={() => handleNewGame(1)}>New Medium Game</button>
         <button onClick={() => handleNewGame(2)}>New Hard Game</button>
        </h2>
        <h3>Mines: {game.mines}</h3>
      </header>

      <main className={`difficulty-${difficulty}`}>
        {game.board.map((boardRow, rowIndex) => {
        return boardRow.map((cell, columnIndex) => {
          return (
            <Cell
              key={columnIndex}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              cell={game.board[rowIndex][columnIndex]}
              recordMove={recordMove}
              recordFlag={recordFlag}
              />
            )
          })
        })}
      </main>

      <footer>
        <h3>Made with 🫶🏽 in Florida</h3>
      </footer>
    </div>
  )
}
