import React, { useState } from 'react'

type Square = '_' | 'F' | ' ' | '*' | '@' | number
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

  async function handleClickCell(row: number, col: number) {
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

  async function handleNewGame() {
    // Make a POST request to ask for a new game
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )
    if (response.ok) {
      // Get the response as JSON
      const newGame = await response.json() as Game
      // Make that the new state!
      setGame(newGame)
    }
  }

  async function handleRightClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: number, col: number) {
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

  function changeCellValue(value: string | number) {
    if (value === 'F') {
      return '⛳️'
    }

    if (value === '*') {
      return '💥'
    }

    if (value === '@') {
      return '💣'
    }

    if(value === '_') {
      return ''
    }

    return value
  }

  const header = game.state ? newHeader() : 'Minesweeper'

  return (
    <div>
      <header>
        <h1>{header}</h1>
        <button onClick={handleNewGame}>New Game</button>
        <h2>Mines: {game.mines}</h2>
      </header>

      <main className='easy'>
        {game.board.map((boardRow, rowIndex) => {
        return boardRow.map((cell, columnIndex) => {
          return (
            <button
              key={columnIndex}
              className={cell === ' ' || cell === 'F' ? undefined : 'reveal'}
              onClick={() => handleClickCell(rowIndex, columnIndex)}
              onContextMenu={(event) => handleRightClick(event, rowIndex, columnIndex)}>
              {changeCellValue(cell)}
            </button>
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
