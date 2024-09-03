'use strict'

import type { ExtendedBool, ShortBool } from '../node_modules/natlib/prelude'

import { board, getMovesTable, interact, kingOccupied, kingVacated, occupied, PieceSpecies, selected, setSpawned, Settings, spawned, vacated, type Board } from './definitions.js'
import { bishopSVG, kingSVG, knightSVG, queenSVG, rookSVG } from './pieces.js'

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

const kingColors = [
    '#17001d',
    '#300123',
    '#450428',
    '#58092d',
    '#690f31',
    '#7b1235',
    '#8d1539',
    '#9e173b',
    '#af173d',
    '#bf1640',
    '#d01441',
    '#df1143',
    '#ef0c45',
    // '#ff0546',
]

type PieceColors = [color: string, outline: string, highlight: string, lowlight: string, lowlight2: string]

export const getColors = (value: number): PieceColors => {
    let _pieceColors = pieceColors
    if (value === Settings.kingValue) {
        _pieceColors = kingColors
        value = 1
    }

    const color = _pieceColors.at(-value - 3)!
    const outline = _pieceColors.at(0)!
    const highlight = _pieceColors.at(-value)!
    const lowlight = _pieceColors.at(-value - 6)!
    const lowlight2 = _pieceColors.at(-value - 8)!

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
    [PieceSpecies.bishop]: bishopSVG,
    [PieceSpecies.rook]: rookSVG,
    [PieceSpecies.queen]: queenSVG,
    [PieceSpecies.king]: kingSVG,
}

let patternIndex = 0

const getPatternSVG = (background: string, color: string) =>
    `<pattern id="pa${++patternIndex}" patternTransform="scale(3.4)" patternUnits="userSpaceOnUse" width="4" height="4"><rect width="4" height="4" fill="${background}"/><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="${color}" stroke-width="1.5"/></pattern>`

let vacatedLast: typeof vacated
let spawnedLast: typeof spawned
let kingVacatedLast: typeof kingVacated

export const createPiece = (x: number, y: number, species: PieceSpecies, value: number) => {
    const piece = document.createElement('div')

    piece.className = `p ps${species}`

    const colorIndex = (value - 1) % Settings.kingValue + 1
    const colors = getColors(colorIndex)

    let svg: string

    if (value === Settings.kingValue || value % 2) {
        svg = speciesSVG[species](...colors)
    }
    else {
        const colors = getColors(colorIndex + 1)
        const lightColors = getColors(colorIndex - 1)

        const colorPattern = getPatternSVG(colors[0], lightColors[0])
        colors[0] = `url(#pa${patternIndex})`

        const highlightPattern = getPatternSVG(colors[2], lightColors[2])
        colors[2] = `url(#pa${patternIndex})`

        const lowlightPattern = getPatternSVG(colors[3], lightColors[3])
        colors[3] = `url(#pa${patternIndex})`

        svg = speciesSVG[species](...colors)
            .replace('</svg>', '<defs>' + colorPattern + highlightPattern + lowlightPattern + '</defs></svg>')
    }

    // Change to setHTMLUnsafe() in 2025
    piece.innerHTML = svg

    if (vacated && vacated !== vacatedLast && occupied?.x === x && occupied?.y === y) {
        // easeOutQuad
        piece.style.animation = `.2s cubic-bezier(.5,1,.89,1) t${vacated.x}${vacated.y}${x}${y}`
        vacatedLast = vacated
    }

    else if (spawned && spawned !== spawnedLast && spawned?.x === x && spawned?.y === y) {
        // easeOutQuad
        piece.style.animation = `.2s cubic-bezier(.5,1,.89,1) sp`
        spawnedLast = spawned
    }

    if (kingVacated && kingVacated !== kingVacatedLast && kingOccupied?.x === x && kingOccupied?.y === y) {
        // easeOutQuad
        piece.style.animation = `.2s cubic-bezier(.5,1,.89,1) t${kingVacated.x}${kingVacated.y}${x}${y}`
        kingVacatedLast = kingVacated
    }

    // Outline
    const g = piece.firstChild!.firstChild!
    const path = g.firstChild!
    const copy = path.cloneNode() as SVGPathElement

    const thiccness = +copy.getAttribute('stroke-width')!
    copy.setAttribute('stroke-width', '' + (4 * thiccness))
    copy.setAttribute('stroke-linejoin', 'round')

    // copy.setAttribute('class', 'st')
    copy.classList.add('st')
    g.insertBefore(copy, path)

    if (species === PieceSpecies.king) {
        return piece
    }

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
