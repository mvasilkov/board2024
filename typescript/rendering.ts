'use strict'

import { Settings } from './definitions.js'
import { knightSVG } from './pieces.js'

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

const cellRefs = getCellRefs()

export const renderBoard = () => {
    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            const cell = cellRefs[y]![x]!
            const piece = document.createElement('div')

            piece.className = 'p'
            piece.innerHTML = knightSVG('#94b0c2', '#1a1c2c', '#f4f4f4', '#566c86', '#333c57')

            cell.appendChild(piece)
        }
    }
}
