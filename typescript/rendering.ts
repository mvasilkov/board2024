'use strict'

import { Settings } from './definitions.js'

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

const getCellRefs = () => {
    const cellRefs: Element[][] = []
    const cells = document.querySelectorAll('.c')

    for (let y = 0; y < Settings.boardHeight; ++y) {
        cellRefs[y] = []

        for (let x = 0; x < Settings.boardWidth; ++x) {
            cellRefs[y]![x] = cells[4 * y + x]!
        }
    }

    return cellRefs
}

export const cellRefs = getCellRefs()

export const renderBoard = () => {
}
