'use strict'

import { Settings } from './definitions.js'
import { knightSVG } from './pieces.js'
import { cellRefs, getColors } from './rendering.js'

export const renderBoard = () => {
    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            // Piece value (debug)
            const value = (x + y * Settings.boardWidth) % 12 + 1

            const cell = cellRefs[y]![x]!
            const piece = document.createElement('div')

            piece.className = 'p'
            piece.innerHTML = knightSVG(...getColors(value))

            cell.appendChild(piece)
        }
    }
}
