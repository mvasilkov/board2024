'use strict'

import { ShortBool } from '../node_modules/natlib/prelude.js'

import { board, PieceSpecies, Settings, spawn } from './definitions.js'
import { renderBoard } from './rendering.js'
// import { renderBoard } from './debug.js'
import { createStyles } from './rendering.js'

createStyles()

const begin = () => {
    // King
    board[3][0] = { species: PieceSpecies.king, value: Settings.kingValue }

    spawn()
    spawn()

    renderBoard(ShortBool.TRUE)
}
