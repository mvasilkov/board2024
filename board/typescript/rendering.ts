'use strict'

import { board, destination, getMovesTable, interact, selected, Settings, vacated, type Board } from './definitions.js'
import { knightSVG } from './pieces.js'

const pieceColors = [
    '#1a1c2c',
    '#34223f',
    '#4c2550',
    '#63285d',
    '#782d5d',
    '#8c325c',
    '#9e3859',
    '#b03e54',
    '#bd4854',
    '#c95154',
    '#d55c53',
    '#df6755',
    '#e87356',
    '#ef7e57',
    '#f48c5c',
    '#f79a60',
    '#faa765',
    '#fcb36a',
    '#fec070',
    '#ffcd75',
]

type PieceColors = [color: string, outline: string, highlight: string, lowlight: string, lowlight2: string]

export const getColors = (value: number): PieceColors => {
    const color = pieceColors.at(-value - 3)!
    const outline = pieceColors.at(0)!
    const highlight = pieceColors.at(-value)!
    const lowlight = pieceColors.at(-value - 6)!
    const lowlight2 = pieceColors.at(-value - 8)!

    return [color, outline, highlight, lowlight, lowlight2]
}

const bindClick = (cell: Element, x: number, y: number) => {
    cell.addEventListener('click', () => {
        interact(x, y)
        renderBoard()
    })
}

const getCellRefs = () => {
    const cellRefs: Element[][] = []
    const cells = document.querySelectorAll('.c')

    for (let y = 0; y < Settings.boardHeight; ++y) {
        cellRefs[y] = []

        for (let x = 0; x < Settings.boardWidth; ++x) {
            bindClick(cellRefs[y]![x] = cells[4 * y + x]!, x, y)
        }
    }

    return cellRefs
}

export const cellRefs = getCellRefs()

let last: typeof vacated

export const createPiece = (x: number, y: number, value: number) => {
    const colors = getColors(value)
    const piece = document.createElement('div')

    piece.className = 'p'
    // Change to setHTMLUnsafe() in 2025
    piece.innerHTML = knightSVG(...colors)

    if (vacated && vacated !== last && destination?.x === x && destination?.y === y) {
        piece.style.animation = `.2s ease-out t${vacated.x}${vacated.y}${x}${y}`
        last = vacated
    }

    // Outline
    const g = piece.firstChild!.firstChild!
    const path = g.firstChild!
    const copy = path.cloneNode() as SVGPathElement

    // copy.setAttribute('class', 'st')
    copy.classList.add('st')
    g.insertBefore(copy, path)

    // Value
    const val = document.createElement('div')

    val.className = `n n${value}`
    val.textContent = '' + 2 ** value
    val.style.backgroundColor = colors[1] + '90'
    val.style.color = colors[2]

    piece.append(val)

    return piece
}

export const renderBoard = () => {
    let highlightMoves: Board | undefined

    if (selected && board[selected.y]![selected.x]) {
        highlightMoves = getMovesTable(selected.x, selected.y)
    }

    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            const cell = cellRefs[y]![x]!

            if (selected?.x === x && selected?.y === y) {
                cell.classList.add('s')
            }
            else {
                cell.classList.remove('s')
            }

            if (highlightMoves?.[y]![x]) {
                cell.classList.add('a')
            }
            else {
                cell.classList.remove('a')
            }

            const piece = <Element>cell.firstChild
            const value = board[y]![x]!

            if (piece && !value) {
                cell.removeChild(piece)
            }

            else if (!piece && value) {
                cell.append(createPiece(x, y, value))
            }

            else if (piece && value) {
                piece.replaceWith(createPiece(x, y, value))
            }
        }
    }
}

export const createStyles = () => {
    const cellSize = 22.275
    let css: string[] = []

    for (let y0 = 0; y0 < Settings.boardHeight; ++y0) {
        for (let x0 = 0; x0 < Settings.boardWidth; ++x0) {
            for (let y1 = 0; y1 < Settings.boardHeight; ++y1) {
                for (let x1 = 0; x1 < Settings.boardWidth; ++x1) {
                    if (x0 === x1 && y0 === y1) continue

                    const Δx = cellSize * (x0 - x1)
                    const Δy = cellSize * (y0 - y1)

                    css.push(`@keyframes t${x0}${y0}${x1}${y1}{0%{transform:translate3d(${Δx}vmin,${Δy}vmin,0)}100%{transform:translate3d(0,0,0)}}`)
                }
            }
        }
    }

    const style = document.createElement('style')
    style.textContent = css.join('')
    document.head.append(style)
}
