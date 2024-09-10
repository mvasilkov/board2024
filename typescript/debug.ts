/** This file is part of King Thirteen.
 * https://github.com/mvasilkov/board2024
 * @license Proprietary | Copyright (c) 2024 Mark Vasilkov
 */
'use strict'

import { PieceSpecies, Settings } from './definitions.js'
import { cellRefs, createPiece } from './rendering.js'

export const renderBoard = (_: unknown) => {
    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            const cell = cellRefs[y]![x]!
            // Piece value (debug)
            const value = x + y * Settings.boardWidth + 1

            if (value === 13) {
                cell.append(createPiece(x, y, PieceSpecies.king, Settings.kingValue))
                continue
            }

            cell.append(createPiece(x, y, PieceSpecies.knight, value))
        }
    }
}
