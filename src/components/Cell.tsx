import React from "react"

type CellProps = {
    cell: string
    rowIndex: number
    columnIndex: number
    recordMove: (_row: number, _column: number) => void
    recordFlag: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, _row: number, _col: number) => void
  }

export function Cell({ cell, rowIndex, columnIndex, recordMove, recordFlag}: CellProps) {
    //Same thing as the argument above
    //const { cell, rowIndex, columnIndex, recordMove } = props

    function handleClickCell() {
      //Now we can call the other method in the main app
      recordMove(rowIndex, columnIndex)
    }

    function handleRightClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: number, col: number) {
        //Call other function
        recordFlag(event, row, col)
      }

    function changeCellValue(value: string | number) {
        if (value === 'F') {
            return <i className="fa fa-flag" />
          }
      
          if (value === '*') {
            return '💥'
          }
      
          if (value === '@') {
            return <i className="fa fa-bomb" />
          }
      
          if(value === '_') {
            return ''
          }
      
          return value
    }

    return (
      <button
        key={columnIndex}
        className={cell === ' ' || cell === 'F' ? undefined : 'reveal'}
        onClick={handleClickCell}
        onContextMenu={(event) => handleRightClick(event, rowIndex, columnIndex)}
    >
        {changeCellValue(cell)}
      </button>
      )
  }