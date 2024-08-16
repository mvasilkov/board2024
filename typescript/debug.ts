'use strict'

import { Settings } from './definitions.js'
import { knightSVG } from './pieces.js'
import { cellRefs } from './rendering.js'

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
