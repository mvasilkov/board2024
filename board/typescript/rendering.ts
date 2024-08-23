'use strict'

import type { ExtendedBool, ShortBool } from '../node_modules/natlib/prelude'

import { board, getMovesTable, interact, occupied, PieceSpecies, selected, setSpawned, Settings, spawned, vacated, type Board } from './definitions.js'
import { kingSVG, knightSVG } from './pieces.js'

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

const kingColors: PieceColors = [
    '#2c1e31',
    '#10121c',
    '#6b2643',
    '#10121c',
    '#10121c',
]

export const getColors = (value: number): PieceColors => {
    if (value < 0) return kingColors

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

type SpeciesSVG = typeof knightSVG

const speciesSVG: Record<PieceSpecies, SpeciesSVG> = {
    [PieceSpecies.knight]: knightSVG,
    [PieceSpecies.bishop]: knightSVG,
    [PieceSpecies.rook]: knightSVG,
    [PieceSpecies.queen]: knightSVG,
    [PieceSpecies.king]: kingSVG,
}

let lastVacated: typeof vacated
let lastSpawned: typeof spawned

export const createPiece = (x: number, y: number, species: PieceSpecies, value: number) => {
    const colors = getColors((value - 1) % 12 + 1)
    const piece = document.createElement('div')

    piece.className = 'p'
    // Change to setHTMLUnsafe() in 2025
    piece.innerHTML = speciesSVG[species](...colors)

    if (vacated && vacated !== lastVacated && occupied?.x === x && occupied?.y === y) {
        // easeOutQuad
        piece.style.animation = `.2s cubic-bezier(.5,1,.89,1) t${vacated.x}${vacated.y}${x}${y}`
        lastVacated = vacated
    }

    else if (spawned && spawned !== lastSpawned && spawned?.x === x && spawned?.y === y) {
        // easeOutQuad
        piece.style.animation = `.2s cubic-bezier(.5,1,.89,1) sp`
        lastSpawned = spawned
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

    // val.className = `n n${value}`
    val.className = 'n'
    val.textContent = '' + 2 ** value
    val.style.backgroundColor = colors[1] + '90'
    val.style.color = colors[2]

    piece.append(val)

    return piece
}

export const renderBoard = (spawnMany?: ExtendedBool) => {
    let highlightMoves: Board<ShortBool> | undefined

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

            let species = PieceSpecies.knight
            let value = 0

            const boardPiece = board[y]![x]
            if (boardPiece) {
                species = boardPiece.species
                value = boardPiece.value
            }

            if (piece && !value) {
                cell.removeChild(piece)
            }

            else if (!piece && value) {
                if (spawnMany) setSpawned(x, y)
                cell.append(createPiece(x, y, species, value))
            }

            else if (piece && value) {
                piece.replaceWith(createPiece(x, y, species, value))
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

                    css.push(`@keyframes t${x0}${y0}${x1}${y1}{0%{transform:translate(${Δx}vmin,${Δy}vmin)}100%{transform:translate(0,0)}}`)
                }
            }
        }
    }

    const style = document.createElement('style')
    style.textContent = css.join('')
    document.head.append(style)

    document.addEventListener('animationstart', event => {
        (event.target as Element | null)?.classList.add('an')
    })

    document.addEventListener('animationend', event => {
        (event.target as Element | null)?.classList.remove('an')
    })
}
