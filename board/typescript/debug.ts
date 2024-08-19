'use strict'

import { Settings } from './definitions.js'
import { cellRefs, createPiece } from './rendering.js'

export const renderBoard = () => {
    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            const cell = cellRefs[y]![x]!
            // Piece value (debug)
            const value = (x + y * Settings.boardWidth) % 12 + 1

            cell.append(createPiece(value))
        }
    }
}
